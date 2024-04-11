import { Component } from "@angular/core";
import { WeatherService } from "../../services";
import { ActivatedRoute } from "@angular/router";
import { Forecast } from "../../types";
import { Observable, map, mergeMap } from "rxjs";

@Component({
  selector: "app-forecasts-list",
  templateUrl: "./forecasts-list.component.html",
  styleUrls: ["./forecasts-list.component.css"],
})
export class ForecastsListComponent {
  public zipCode$: Observable<string> = this.route.params.pipe(
    map((params) => params["zipcode"])
  );
  public forecast$: Observable<Forecast> = this.zipCode$.pipe(
    mergeMap((zipCode) => this.weatherService.getForecast(zipCode))
  );

  constructor(
    private readonly weatherService: WeatherService,
    private readonly route: ActivatedRoute
  ) {}
}
