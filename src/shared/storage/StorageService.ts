const STORAGE_PREFIX = 'lifeboard:'

export class StorageService {
  /**
   * Get data from localStorage by key.
   * Returns null if key doesn't exist, data is invalid, or localStorage is unavailable.
   */
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key)
      if (raw === null) return null
      return JSON.parse(raw) as T
    } catch {
      console.warn(`[StorageService] Failed to read key "${key}", returning null`)
      return null
    }
  }

  /**
   * Save data to localStorage by key.
   * Silently fails if localStorage is unavailable or quota exceeded.
   */
  set<T>(key: string, data: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
    } catch {
      console.warn(`[StorageService] Failed to save key "${key}"`)
    }
  }

  /**
   * Remove a key from localStorage.
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
    } catch {
      console.warn(`[StorageService] Failed to remove key "${key}"`)
    }
  }

  /**
   * Clear all app data from localStorage (only lifeboard: keys).
   */
  clear(): void {
    try {
      const keys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith(STORAGE_PREFIX)) {
          keys.push(key)
        }
      }
      keys.forEach(key => localStorage.removeItem(key))
    } catch {
      console.warn('[StorageService] Failed to clear storage')
    }
  }
}

/** Singleton instance for app-wide use */
export const storage = new StorageService()
