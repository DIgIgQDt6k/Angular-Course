import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ForecastsListComponent } from "./forecasts-list.component";
import { WeatherService } from "../../services";
import { BrowserModule, By } from "@angular/platform-browser";
import { ActivatedRoute, Params, RouterModule } from "@angular/router";
import { firstValueFrom, of } from "rxjs";
import { Forecast } from "app/types";

describe("ForecastsListComponent", () => {
  let component: ForecastsListComponent;
  let fixture: ComponentFixture<ForecastsListComponent>;

  let weatherServiceSpy: Partial<WeatherService>;

  let forecast: Forecast = {
    city: { name: "city" },
    list: [
      { dt: 1, weather: [{ main: "main" }], temp: { min: 20, max: 40 } },
      { dt: 1, weather: [{ main: "main" }], temp: { min: 20, max: 40 } },
    ],
  } as Forecast;

  beforeEach(async () => {
    weatherServiceSpy = {
      getForecast: jest.fn(() => of(forecast)),
      getWeatherIcon: jest.fn(() => "http://localhost/image.png"),
    };

    await TestBed.configureTestingModule({
      imports: [BrowserModule, RouterModule],
      declarations: [ForecastsListComponent],
      providers: [
        { provide: WeatherService, useValue: weatherServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ zipcode: "zipCode" } as Params),
          } as ActivatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForecastsListComponent);
    component = fixture.componentInstance;
  });

  it("should get zipCode from route params", async () => {
    const result = await firstValueFrom(component.zipCode$);
    expect(result).toBe("zipCode");
  });

  it("should get forecast from weather service", async () => {
    const result = await firstValueFrom(component.forecast$);

    expect(result).toBe(forecast);
    expect(weatherServiceSpy.getForecast).toHaveBeenCalledWith("zipCode");
  });

  it("should render correctly", () => {
    fixture.detectChanges();

    const h3El = fixture.debugElement.query(By.css("h3"))
      .nativeElement as HTMLElement;
    expect(h3El.innerHTML).toBe("5-day forecast for city");

    const liElements = fixture.debugElement.queryAll(By.css("li"));
    expect(liElements).toHaveLength(2);

    const liEl = liElements[0];
    expect(liEl.nativeElement.innerHTML).toBe(
      ' Thursday, Jan 1: main - Min: 20 - Max: 40 <img class="icon" src="http://localhost/image.png">'
    );
  });
});
