/**
 * Utility functions for optimized data fetching
 */
import { getApiUrl } from './api-utils';

/**
 * Cache for storing API responses
 */
const apiCache = new Map<string, {
  data: any;
  timestamp: number;
}>();

/**
 * Default cache expiration time in milliseconds (5 minutes)
 */
const DEFAULT_CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Options for the fetchWithCache function
 */
interface FetchWithCacheOptions {
  /**
   * Whether to bypass the cache and force a fresh fetch
   */
  forceRefresh?: boolean;
  
  /**
   * Cache expiration time in milliseconds
   */
  cacheExpiration?: number;
  
  /**
   * Fetch options to pass to the fetch API
   */
  fetchOptions?: RequestInit;
}

/**
 * Fetch data from an API endpoint with caching
 * 
 * @param endpoint The API endpoint to fetch from
 * @param options Options for the fetch operation
 * @returns The fetched data
 */
export async function fetchWithCache<T>(
  endpoint: string,
  options: FetchWithCacheOptions = {}
): Promise<T> {
  const {
    forceRefresh = false,
    cacheExpiration = DEFAULT_CACHE_EXPIRATION,
    fetchOptions
  } = options;
  
  const url = getApiUrl(endpoint);
  const cacheKey = `${url}:${JSON.stringify(fetchOptions)}`;
  
  // Check if we have a valid cached response
  const cachedResponse = apiCache.get(cacheKey);
  const now = Date.now();
  
  if (
    !forceRefresh &&
    cachedResponse &&
    now - cachedResponse.timestamp < cacheExpiration
  ) {
    return cachedResponse.data;
  }
  
  // Fetch fresh data
  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      // Try to parse error message from response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    apiCache.set(cacheKey, {
      data,
      timestamp: now
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}

/**
 * Clear the API cache
 * 
 * @param endpoint Optional endpoint to clear the cache for. If not provided, clears the entire cache.
 */
export function clearApiCache(endpoint?: string): void {
  if (endpoint) {
    const url = getApiUrl(endpoint);
    
    // Clear all entries that start with the URL
    for (const key of apiCache.keys()) {
      if (key.startsWith(url)) {
        apiCache.delete(key);
      }
    }
  } else {
    apiCache.clear();
  }
}
