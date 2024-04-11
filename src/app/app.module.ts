import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { LocationService } from "./services/location.service";
import { ForecastsListComponent } from "./features/forecasts-list/forecasts-list.component";
import { WeatherService } from "./services/weather.service";
import { MainPageComponent } from "./features/main-page/main-page.component";
import { RouterModule } from "@angular/router";
import { routing } from "./app.routing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { CacheService } from "./services/cache.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register("/Angular-Course/ngsw-worker.js", {
      enabled: true,
    }),
    MainPageComponent,
    ForecastsListComponent,
  ],
  providers: [LocationService, WeatherService, CacheService],
  bootstrap: [AppComponent],
})
export class AppModule {}
