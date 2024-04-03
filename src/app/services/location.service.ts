import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  signal,
} from "@angular/core";

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  private _locations: WritableSignal<string[]> = signal([]);

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this._locations.set(JSON.parse(locString));
    }
  }

  public addLocation(zipcode: string) {
    this._locations.update((locations) => {
      const newLocations = [...locations, zipcode];
      localStorage.setItem(LOCATIONS, JSON.stringify(newLocations));
      return newLocations;
    });
  }

  public removeLocation(zipcode: string) {
    this._locations.update((locations) => {
      const index = locations.indexOf(zipcode);
      if (index !== -1) {
        locations.splice(index, 1);
        localStorage.setItem(LOCATIONS, JSON.stringify(locations));
        return [...locations];
      }

      return locations;
    });
  }

  public getLocations(): Signal<string[]> {
    return this._locations.asReadonly();
  }
}
