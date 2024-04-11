import { fakeAsync, tick } from "@angular/core/testing";
import { CacheService } from "./cache.service";

describe("CacheService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  it("should set a cache item", () => {
    const service = new CacheService();

    const item = { id: "id" };
    const key = "key";

    service.setItem(key, item, { cacheDuration: 120 });

    const actualItem = JSON.parse(window.localStorage.getItem(key));

    expect(actualItem).toEqual(expect.objectContaining({ value: item }));
  });

  it("should get a cache item", () => {
    const service = new CacheService();

    const item = { id: "id" };
    const key = "key";

    service.setItem(key, item, { cacheDuration: 120 });

    const actualItem = service.getItem<{ id: string }>(key);

    expect(actualItem).toEqual(item);
  });

  it("should return null when cache expired", fakeAsync(() => {
    const service = new CacheService();

    const item = { id: "id" };
    const key = "key";

    service.setItem(key, item, { cacheDuration: 0.1 });

    tick(1000);
    const actualItem = service.getItem<{ id: string }>(key);

    expect(actualItem).toBeNull();
  }));
});
