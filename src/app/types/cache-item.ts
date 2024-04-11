export interface CacheItem<T> {
  expirationTime: Date;
  value: T;
}

export interface CacheOptions {
  /**
   * Cache Duration in minutes
   */
  cacheDuration: number;
}
