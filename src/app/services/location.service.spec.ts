import { TestBed } from "@angular/core/testing";
import { LOCATIONS, LocationService } from "./location.service";

describe("LocationService", () => {
  let locationService: LocationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LocationService, useClass: LocationService }],
    });

    localStorage.removeItem(LOCATIONS);
    locationService = TestBed.inject(LocationService);
  });

  it("should emit signal with added location when addLocation called", () => {
    locationService.addLocation("location 1");
    expect(locationService.getLocations()()).toEqual(["location 1"]);

    locationService.addLocation("location 2");
    expect(locationService.getLocations()()).toEqual([
      "location 1",
      "location 2",
    ]);

    expect(localStorage.getItem(LOCATIONS)).toEqual(
      '["location 1","location 2"]'
    );
  });

  it("should emit signal with removed location when removeLocation called", () => {
    locationService.addLocation("location 1");
    locationService.addLocation("location 2");
    locationService.addLocation("location 3");
    locationService.addLocation("location 4");

    locationService.removeLocation("location 1");

    const locations = locationService.getLocations()();
    expect(locations).toEqual(["location 2", "location 3", "location 4"]);
    locationService.removeLocation("location 2");

    expect(locationService.getLocations()()).toEqual([
      "location 3",
      "location 4",
    ]);

    expect(localStorage.getItem(LOCATIONS)).toEqual(
      '["location 3","location 4"]'
    );
  });
});
