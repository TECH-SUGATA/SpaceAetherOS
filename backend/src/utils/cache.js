// src/utils/cache.js
// Lightweight in-memory cache — no extra packages needed

const store = new Map();

const cache = {
  /**
   * Get a cached value
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    const item = store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      store.delete(key);
      return null;
    }
    return item.value;
  },

  /**
   * Set a cached value
   * @param {string} key
   * @param {any} value
   * @param {number} ttlSeconds - time to live in seconds (default 300s)
   */
  set(key, value, ttlSeconds = 300) {
    store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  },

  /**
   * Delete a cached value
   */
  del(key) {
    store.delete(key);
  },

  /**
   * Clear all cached values
   */
  clear() {
    store.clear();
  },

  /**
   * Get cache size
   */
  size() {
    return store.size;
  },
};

module.exports = cache;
