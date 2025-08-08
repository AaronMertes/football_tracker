export type StorageKey = 'games' | 'settings'

export class StorageService {
  static getItem<T>(key: StorageKey, fallback: T): T {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
      return fallback
    }
  }

  static setItem<T>(key: StorageKey, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // no-op in MVP; could surface toast in UI
    }
  }
}

