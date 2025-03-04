interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>>;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public set<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (this.isExpired(item)) {
      this.delete(key);
      return null;
    }

    return item.value;
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    if (this.isExpired(item)) {
      this.delete(key);
      return false;
    }

    return true;
  }

  public invalidateByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.delete(key);
      }
    }
  }

  private isExpired<T>(item: CacheItem<T>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  // Helper methods for specific cache keys
  public static getCacheKey(type: string, id?: string): string {
    return id ? `${type}:${id}` : type;
  }

  public static getListCacheKey(type: string, filters?: Record<string, any>): string {
    if (!filters) {
      return `${type}:list`;
    }
    const filterString = Object.entries(filters)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
    return `${type}:list:${filterString}`;
  }
}

export const cacheService = CacheService.getInstance(); 