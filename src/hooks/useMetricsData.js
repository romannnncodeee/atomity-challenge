// useMetricsData – Custom caching hook
// Fetches from JSONPlaceholder   maps to infra mock data
// In-memory cache prevents redundant network requests.

import { useState, useEffect, useRef } from 'react';

//  Global in-memory cache (survives re-renders, not page reload) 
const globalCache = {};
const STALE_MS = 5 * 60 * 1000; // 5 minutes stale window

//  Deterministic helpers 
const seededRandom = (seed) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

const lerp = (min, max, t) => Math.round(min + (max - min) * t);

const STATUS_LABELS = ['Healthy', 'Degraded', 'Healthy', 'Healthy', 'Warning'];
const STATUS_COLORS = {
  Healthy:  'var(--color-accent-success)',
  Degraded: 'var(--color-accent-danger)',
  Warning:  'var(--color-accent-warn)',
};

const REGION_LABELS = ['us-east-1', 'eu-west-2', 'ap-south-1', 'us-west-2'];

// Map raw API post - Cluster
const mapPostToCluster = (post) => {
  const seed = post.id;
  const cpu   = lerp(12, 94, seededRandom(seed * 3));
  const mem   = lerp(20, 88, seededRandom(seed * 7));
  const pods  = lerp(4,  64, seededRandom(seed * 13));
  const cost  = parseFloat((seededRandom(seed * 17) * 4800 + 200).toFixed(2));
  const statusIndex = seed % STATUS_LABELS.length;

  return {
    id:       `cluster-${post.id}`,
    name:     `Cluster ${String.fromCharCode(64 + ((post.id - 1) % 26) + 1)}`,
    region:   REGION_LABELS[seed % REGION_LABELS.length],
    cpu,
    memory:   mem,
    pods,
    cost,
    status:   STATUS_LABELS[statusIndex],
    statusColor: STATUS_COLORS[STATUS_LABELS[statusIndex]],
    rawId:    post.id,
  };
};

// Map raw API post - Namespace (child of cluster)
const mapPostToNamespace = (post, parentCluster) => {
  const seed = post.id + parentCluster.rawId * 100;
  const cpu   = lerp(5, parentCluster.cpu - 2, seededRandom(seed * 5));
  const mem   = lerp(8, parentCluster.memory - 2, seededRandom(seed * 9));
  const pods  = lerp(1, Math.max(2, Math.floor(parentCluster.pods / 3)), seededRandom(seed * 11));
  const cost  = parseFloat((parentCluster.cost * seededRandom(seed * 15) * 0.4 + 30).toFixed(2));

  return {
    id:         `ns-${parentCluster.rawId}-${post.id}`,
    name:       `ns-${post.title.split(' ')[0].toLowerCase().slice(0, 8)}`,
    parentId:   parentCluster.id,
    cpu,
    memory:     mem,
    pods,
    cost,
    status:     STATUS_LABELS[seed % STATUS_LABELS.length],
    statusColor: STATUS_COLORS[STATUS_LABELS[seed % STATUS_LABELS.length]],
    rawId:      post.id,
  };
};

// Map raw API post- Pod (child of namespace) 
const mapPostToPod = (post, parentNs) => {
  const seed = post.id + parentNs.rawId * 200;
  const cpu   = lerp(1, Math.max(3, parentNs.cpu - 1), seededRandom(seed * 3));
  const mem   = lerp(2, Math.max(5, parentNs.memory - 2), seededRandom(seed * 7));
  const uptime = lerp(60, 99, seededRandom(seed * 19));
  const cost  = parseFloat((parentNs.cost * seededRandom(seed * 23) * 0.3 + 5).toFixed(2));

  return {
    id:         `pod-${parentNs.rawId}-${post.id}`,
    name:       `pod-${post.title.split(' ').slice(0, 2).join('-').toLowerCase().slice(0, 14)}`,
    parentId:   parentNs.id,
    cpu,
    memory:     mem,
    uptime,
    cost,
    restarts:   Math.floor(seededRandom(seed * 29) * 8),
    status:     STATUS_LABELS[seed % STATUS_LABELS.length],
    statusColor: STATUS_COLORS[STATUS_LABELS[seed % STATUS_LABELS.length]],
    rawId:      post.id,
  };
};


const fetchWithCache = async (cacheKey, fetcher) => {
  const cached = globalCache[cacheKey];
  const now = Date.now();

  if (cached && now - cached.timestamp < STALE_MS) {
    return { data: cached.data, fromCache: true };
  }

  const data = await fetcher();
  globalCache[cacheKey] = { data, timestamp: now };
  return { data, fromCache: false };
};

// Hook: fetch clusters 
export const useClusters = () => {
  const [state, setState] = useState({ data: null, isLoading: true, isError: false });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const run = async () => {
      try {
        const { data: posts } = await fetchWithCache('clusters', async () => {
          const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6');
          if (!res.ok) throw new Error('Network error');
          return res.json();
        });
        if (mounted.current) {
          setState({ data: posts.map(mapPostToCluster), isLoading: false, isError: false });
        }
      } catch {
        if (mounted.current) {
          setState({ data: null, isLoading: false, isError: true });
        }
      }
    };
    run();
    return () => { mounted.current = false; };
  }, []);

  return state;
};

// Hook: fetch namespaces for a cluster
export const useNamespaces = (cluster) => {
  const [state, setState] = useState({ data: null, isLoading: true, isError: false });
  const mounted = useRef(true);

  useEffect(() => {
    if (!cluster) return;
    mounted.current = true;
    setState({ data: null, isLoading: true, isError: false });

    const run = async () => {
      try {
        const cacheKey = `namespaces-${cluster.id}`;
        const { data: posts } = await fetchWithCache(cacheKey, async () => {
          const res = await fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${(cluster.rawId % 10) + 1}&_limit=5`
          );
          if (!res.ok) throw new Error('Network error');
          return res.json();
        });
        if (mounted.current) {
          setState({
            data: posts.slice(0, 4).map((p) => mapPostToNamespace(p, cluster)),
            isLoading: false,
            isError: false,
          });
        }
      } catch {
        if (mounted.current) setState({ data: null, isLoading: false, isError: true });
      }
    };
    run();
    return () => { mounted.current = false; };
  }, [cluster?.id]);

  return state;
};

// Hook: fetch pods for a namespace
export const usePods = (namespace) => {
  const [state, setState] = useState({ data: null, isLoading: true, isError: false });
  const mounted = useRef(true);

  useEffect(() => {
    if (!namespace) return;
    mounted.current = true;
    setState({ data: null, isLoading: true, isError: false });

    const run = async () => {
      try {
        const cacheKey = `pods-${namespace.id}`;
        const { data: posts } = await fetchWithCache(cacheKey, async () => {
          const res = await fetch(
            `https://jsonplaceholder.typicode.com/posts?_limit=10&_start=${namespace.rawId % 5}`
          );
          if (!res.ok) throw new Error('Network error');
          return res.json();
        });
        if (mounted.current) {
          setState({
            data: posts.slice(0, 5).map((p) => mapPostToPod(p, namespace)),
            isLoading: false,
            isError: false,
          });
        }
      } catch {
        if (mounted.current) setState({ data: null, isLoading: false, isError: true });
      }
    };
    run();
    return () => { mounted.current = false; };
  }, [namespace?.id]);

  return state;
};

export { globalCache };
