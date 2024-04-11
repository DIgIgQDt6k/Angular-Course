import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { WeatherService } from "app/services";

@Component({
  selector: "app-weather-cache-settings",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./weather-cache-settings.component.html",
})
export class WeatherCacheSettingsComponent {
  /**
   * Cache Duration in minutes
   */
  public weatherServiceCacheDuration = 120;

  constructor(private readonly weatherService: WeatherService) {}

  public setWeatherCacheDuration(): void {
    this.weatherService.cacheDuration = this.weatherServiceCacheDuration;
  }
}
