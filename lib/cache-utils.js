/**
 * @fileoverview Simple caching and state management utilities
 * @author Pisang Ijo Evi
 */

import { useState, useEffect } from 'react';

/**
 * Simple in-memory cache with TTL support
 */
class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Set cache value with optional TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl = 300000) { // 5 minutes default
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set value
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });

    // Set expiration timer
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timers.set(key, timer);
  }

  /**
   * Get cache value
   * @param {string} key - Cache key
   * @returns {any} Cached value or null
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Delete cache entry
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
    
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Global cache instance
const globalCache = new SimpleCache();

/**
 * Cache decorator for API responses
 * @param {string} key - Cache key
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Function} Decorator function
 */
export function cached(key, ttl = 300000) {
  return function (target, propertyName, descriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args) {
      const cacheKey = `${key}_${JSON.stringify(args)}`;
      
      // Try to get from cache
      const cached = globalCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Execute method and cache result
      const result = await method.apply(this, args);
      globalCache.set(cacheKey, result, ttl);
      
      return result;
    };

    return descriptor;
  };
}

/**
 * Fetch with caching wrapper
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} ttl - Cache TTL in milliseconds
 * @returns {Promise} Fetch response
 */
export async function cachedFetch(url, options = {}, ttl = 300000) {
  const cacheKey = `fetch_${url}_${JSON.stringify(options)}`;
  
  // Try cache first
  const cached = globalCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch and cache
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      globalCache.set(cacheKey, data, ttl);
    }
    
    return data;
  } catch (error) {
    console.error('Cached fetch error:', error);
    throw error;
  }
}

/**
 * React hook for cached API calls
 * @param {string} key - Cache/hook key
 * @param {Function} fetchFn - Function that returns a promise
 * @param {Object} options - Hook options
 * @returns {Object} Hook state
 */
export function useCachedApi(key, fetchFn, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { 
    ttl = 300000, 
    dependencies = [], 
    enabled = true 
  } = options;

  useEffect(() => {
    if (!enabled) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Try cache first
        const cached = globalCache.get(key);
        if (cached) {
          setData(cached);
          setLoading(false);
          return;
        }

        // Fetch new data
        const result = await fetchFn();
        globalCache.set(key, result, ttl);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [key, ttl, enabled, ...dependencies]);

  const refetch = async () => {
    globalCache.delete(key);
    
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      globalCache.set(key, result, ttl);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    globalCache.delete(key);
  };

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
}

/**
 * LocalStorage with expiration support
 */
export const persistentStorage = {
  /**
   * Set item with expiration
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {number} ttl - Time to live in milliseconds
   */
  setItem(key, value, ttl = 86400000) { // 24 hours default
    const item = {
      value,
      expiry: Date.now() + ttl
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn('LocalStorage setItem failed:', error);
    }
  },

  /**
   * Get item with expiration check
   * @param {string} key - Storage key
   * @returns {any} Stored value or null
   */
  getItem(key) {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      
      // Check expiration
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn('LocalStorage getItem failed:', error);
      return null;
    }
  },

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('LocalStorage removeItem failed:', error);
    }
  },

  /**
   * Clear all expired items
   */
  clearExpired() {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();

      keys.forEach(key => {
        const itemStr = localStorage.getItem(key);
        if (itemStr) {
          try {
            const item = JSON.parse(itemStr);
            if (item.expiry && now > item.expiry) {
              localStorage.removeItem(key);
            }
          } catch {
            // Invalid JSON, skip
          }
        }
      });
    } catch (error) {
      console.warn('LocalStorage clearExpired failed:', error);
    }
  }
};

// Export cache instance for direct access
export { globalCache };