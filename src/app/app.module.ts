import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { ZipcodeEntryComponent } from "./features/zipcode-entry/zipcode-entry.component";
import { LocationService } from "./services/location.service";
import { ForecastsListComponent } from "./features/forecasts-list/forecasts-list.component";
import { WeatherService } from "./services/weather.service";
import { CurrentConditionsComponent } from "./features/current-conditions/current-conditions.component";
import { MainPageComponent } from "./features/main-page/main-page.component";
import { RouterModule } from "@angular/router";
import { routing } from "./app.routing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import {
  AppTabDirective,
  TabsComponent,
} from "./ui/tabs-component/tabs.component";

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    MainPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register("/Angular-Course/ngsw-worker.js", {
      enabled: true,
    }),
    TabsComponent,
    AppTabDirective,
    CurrentConditionsComponent,
  ],
  providers: [LocationService, WeatherService],
  bootstrap: [AppComponent],
})
export class AppModule {}
