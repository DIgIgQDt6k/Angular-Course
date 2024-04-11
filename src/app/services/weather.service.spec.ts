import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { WeatherService } from "./weather.service";
import { CurrentConditions, Forecast } from "app/types";
import { CacheService } from "./cache.service";
import { firstValueFrom } from "rxjs";

describe("WeatherService", () => {
  let weatherService: WeatherService;
  let httpTestingController: HttpTestingController;
  let cacheService;

  beforeEach(() => {
    cacheService = {
      setItem: jest.fn(),
      getItem: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: WeatherService, useClass: WeatherService },
        { provide: CacheService, useValue: cacheService },
      ],
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    weatherService = TestBed.inject(WeatherService);
  });

  it("should make weather call for addCurrentConditions and remove conditions for removeCurrentConditions", () => {
    const zip = "zip";
    const returnValue = {} as CurrentConditions;

    weatherService.addCurrentConditions(zip).then(() => {
      let conditions = weatherService.getCurrentConditions()();

      expect(conditions).toHaveLength(1);
      expect(conditions[0]).toEqual({ ...returnValue, zip });

      weatherService.removeCurrentConditions(zip);

      conditions = weatherService.getCurrentConditions()();
      expect(conditions).toHaveLength(0);

      expect(cacheService.setItem).toHaveBeenCalledWith(zip, returnValue);
    });

    const request = httpTestingController.expectOne(
      `${WeatherService.URL}/weather?zip=${zip},us&units=imperial&APPID=${WeatherService.APPID}`
    );

    request.flush(returnValue);
  });

  it("should cache conditions", () => {
    const zip = "zip";
    const returnValue = {} as CurrentConditions;
    cacheService.getItem.mockReturnValue(returnValue);

    weatherService.addCurrentConditions(zip).then(() => {
      let conditions = weatherService.getCurrentConditions()();

      expect(conditions).toHaveLength(1);
      expect(conditions[0]).toEqual({ ...returnValue, zip });
      expect(cacheService.getItem).toHaveBeenCalledWith(zip);
    });

    httpTestingController.expectNone(
      `${WeatherService.URL}/weather?zip=${zip},us&units=imperial&APPID=${WeatherService.APPID}`
    );
  });

  test.each([
    { id: 200, icon: "art_storm.png" },
    { id: 232, icon: "art_storm.png" },
    { id: 501, icon: "art_rain.png" },
    { id: 511, icon: "art_rain.png" },
    { id: 520, icon: "art_light_rain.png" },
    { id: 531, icon: "art_light_rain.png" },
    { id: 600, icon: "art_snow.png" },
    { id: 622, icon: "art_snow.png" },
    { id: 801, icon: "art_clouds.png" },
    { id: 804, icon: "art_clouds.png" },
    { id: 741, icon: "art_fog.png" },
    { id: 761, icon: "art_fog.png" },
    { id: 100, icon: "art_clear.png" },
    { id: 999, icon: "art_clear.png" },
  ])("should return icon: $icon for id: $id", ({ id, icon }) => {
    const result = weatherService.getWeatherIcon(id);
    expect(result).toContain(icon);
  });

  it("should getForecast", () => {
    const zipcode = "zip";
    const expectedResult = {} as Forecast;

    firstValueFrom(weatherService.getForecast(zipcode)).then((result) => {
      expect(result).toEqual(expectedResult);

      expect(cacheService).toHaveBeenCalledWith(zipcode, result);
    });

    const result = httpTestingController.expectOne(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );

    result.flush(expectedResult);
  });

  it("should get Forecast from cache", async () => {
    const zipcode = "zip";
    const expectedResult = {} as Forecast;

    cacheService.getItem.mockReturnValue(expectedResult);

    const result = await firstValueFrom(weatherService.getForecast(zipcode));

    expect(result).toEqual(expectedResult);
    expect(cacheService.getItem).toHaveBeenCalledWith(zipcode);

    httpTestingController.expectNone(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );
  });
});
