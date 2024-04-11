import { Injectable } from "@angular/core";
import { CacheItem, CacheOptions } from "app/types";

@Injectable()
export class CacheService {
  public setItem<TCacheItem>(
    cacheKey: string,
    cacheValue: TCacheItem,
    options: CacheOptions
  ): void {
    const cacheItem: CacheItem<TCacheItem> = {
      value: cacheValue,
      expirationTime: new Date(
        new Date().getTime() + options.cacheDuration * 6000
      ),
    };

    const json = JSON.stringify(cacheItem);
    window.localStorage.setItem(cacheKey, json);
  }

  public getItem<TCacheItem>(cacheKey: string): TCacheItem | null {
    const json = window.localStorage.getItem(cacheKey);
    if (!json) {
      return null;
    }

    const cacheItem = JSON.parse(json) as CacheItem<TCacheItem>;

    if (new Date(cacheItem.expirationTime) > new Date()) {
      return cacheItem.value;
    } else {
      return null;
    }
  }
}
