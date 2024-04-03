import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Signal,
} from "@angular/core";
import { WeatherService, LocationService } from "../../services";
import { Router } from "@angular/router";
import { ConditionsAndZip, ConditionsAndZipTab } from "../../types";
import { Tab } from "app/types";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentConditionsComponent {
  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> =
    this.weatherService.getCurrentConditions();

  public currentConditionsByZipTabs: Signal<ConditionsAndZipTab[]> = computed(
    () => {
      const conditions = this.currentConditionsByZip();

      return conditions.map(
        (condition, index) =>
          ({
            ...condition,
            title: `${condition.data.name} (${condition.zip})`,
            isActive: index === 0,
          } as ConditionsAndZipTab)
      );
    }
  );

  private currentLocations: Signal<string[]> =
    this.locationService.getLocations();

  public constructor() {
    effect(
      () => {
        const locations = this.currentLocations();

        locations.forEach((location) => {
          this.weatherService.removeCurrentConditions(location);
        });

        locations.forEach(async (location) => {
          await this.weatherService.addCurrentConditions(location);
        });
      },
      { allowSignalWrites: true }
    );
  }

  public removeLocation(tab: ConditionsAndZipTab) {
    this.weatherService.removeCurrentConditions(tab.zip);
    this.locationService.removeLocation(tab.zip);
  }
}
