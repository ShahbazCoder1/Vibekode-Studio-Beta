// Enhanced request deduplication cache with TTL
const requestCache = new Map<
  string,
  { promise: Promise<unknown>; timestamp: number; ttl: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes default TTL

// Helper function to create cache key with better hashing
export function createCacheKey(functionName: string, ...params: unknown[]): string {
  const paramsHash = JSON.stringify(params).replace(/\s+/g, "");
  return `${functionName}:${Buffer.from(paramsHash)
    .toString("base64")
    .slice(0, 32)}`;
}

// Enhanced cache cleanup
export function cleanupExpiredCache() {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      requestCache.delete(key);
    }
  }
}

// Enhanced deduplication with TTL support
export async function executeWithDeduplication<T>(
  cacheKey: string,
  executionFunction: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> {
  cleanupExpiredCache();

  const cached = requestCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.promise as Promise<T>;
  }

  const requestPromise = executionFunction().finally(() => {
    setTimeout(() => requestCache.delete(cacheKey), ttl);
  });

  requestCache.set(cacheKey, {
    promise: requestPromise,
    timestamp: Date.now(),
    ttl,
  });

  return requestPromise;
}
