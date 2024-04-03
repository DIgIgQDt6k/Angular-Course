import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { WeatherService } from "./weather.service";
import { CurrentConditions } from "app/types";

describe("WeatherService", () => {
  let weatherService: WeatherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WeatherService, useClass: WeatherService }],
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
    });

    const request = httpTestingController.expectOne(
      `${WeatherService.URL}/weather?zip=${zip},us&units=imperial&APPID=${WeatherService.APPID}`
    );

    request.flush(returnValue);
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
});
