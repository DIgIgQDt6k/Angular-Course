import { Injectable, Signal, signal } from "@angular/core";
import { Observable, firstValueFrom, of, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CurrentConditions, ConditionsAndZip, Forecast } from "../types";
import { CacheService } from "./cache.service";

@Injectable()
export class WeatherService {
  static URL = "https://api.openweathermap.org/data/2.5";
  static APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(
    private http: HttpClient,
    private readonly cacheService: CacheService
  ) {}

  private _cacheDuration: number = 120;

  public get cacheDuration() {
    return this._cacheDuration;
  }
  public set cacheDuration(value: number) {
    this._cacheDuration = value;
  }

  public async addCurrentConditions(zipcode: string): Promise<void> {
    const cahcedItem = this.cacheService.getItem<CurrentConditions>(zipcode);
    if (cahcedItem) {
      this.currentConditions.update((conditions) => [...conditions, condition]);
      return;
    }

    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    const data = await firstValueFrom(
      this.http.get<CurrentConditions>(
        `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`
      )
    );

    const condition = { zip: zipcode, data };

    this.cacheService.setItem(zipcode, condition, {
      cacheDuration: this._cacheDuration,
    });

    this.currentConditions.update((conditions) => [...conditions, condition]);
  }

  public removeCurrentConditions(zipcode: string) {
    this.currentConditions.update((conditions) => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode) conditions.splice(+i, 1);
      }
      return [...conditions];
    });
  }

  public getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  public getForecast(zipcode: string): Observable<Forecast> {
    const cachedItem = this.cacheService.getItem<Forecast>(zipcode);
    if (cachedItem) {
      return of(cachedItem);
    }

    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http
      .get<Forecast>(
        `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
      )
      .pipe(
        tap((forecast) =>
          this.cacheService.setItem(zipcode, forecast, {
            cacheDuration: this._cacheDuration,
          })
        )
      );
  }

  public getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }
}
