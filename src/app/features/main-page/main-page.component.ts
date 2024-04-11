import { Component } from "@angular/core";
import { WeatherService } from "app/services";
import { CurrentConditionsComponent } from "../current-conditions/current-conditions.component";
import { WeatherCacheSettingsComponent } from "../weather-cache-settings/weather-cache-settings.component";
import { ZipcodeEntryComponent } from "../zipcode-entry/zipcode-entry.component";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  standalone: true,
  imports: [
    CurrentConditionsComponent,
    WeatherCacheSettingsComponent,
    ZipcodeEntryComponent,
  ],
})
export class MainPageComponent {}
