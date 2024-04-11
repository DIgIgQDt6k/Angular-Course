import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CurrentConditionsComponent } from "./current-conditions.component";
import { LocationService, WeatherService } from "../../services";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { BrowserModule, By } from "@angular/platform-browser";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { signal } from "@angular/core";
import {
  CurrentConditions,
  ConditionsAndZip,
  ConditionsAndZipTab,
} from "../../types";
import { TabsComponent } from "../../ui/tabs-component/tabs.component";

describe("CurrentConditionsComponent", () => {
  let component: CurrentConditionsComponent;
  let fixture: ComponentFixture<CurrentConditionsComponent>;

  let locationServiceSpy: Partial<LocationService>;
  let weatherServiceSpy: Partial<WeatherService>;

  const locations: string[] = ["location 1"];
  const currentConditions: ConditionsAndZip[] = [
    {
      zip: "zip",
      data: {
        weather: [{ main: "Weather" }],
        main: { temp: 40.12, temp_max: 60, temp_min: 20 },
        name: "Name",
      } as CurrentConditions,
    },
  ];

  beforeEach(async () => {
    locationServiceSpy = {
      getLocations: jest.fn(() => signal(locations)),
      removeLocation: jest.fn(),
    };

    weatherServiceSpy = {
      addCurrentConditions: jest.fn(),
      getCurrentConditions: jest.fn(() => signal(currentConditions)),
      getWeatherIcon: jest.fn(() => "http://localhost/icon.png"),
      removeCurrentConditions: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        CurrentConditionsComponent,
      ],
      declarations: [],
      providers: [
        { provide: LocationService, useValue: locationServiceSpy },
        { provide: WeatherService, useValue: weatherServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentConditionsComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("actions", () => {
    it("should addCurrentConditions when locations change", () => {
      fixture.detectChanges();

      expect(weatherServiceSpy.addCurrentConditions).toHaveBeenCalledWith(
        locations[0]
      );
    });

    it("should remove locations and weather when tabs emit removeLocation", () => {
      const tab = { zip: "zip" } as ConditionsAndZipTab;

      const tabs = fixture.debugElement.query(By.directive(TabsComponent));
      const tabsComponent =
        tabs.componentInstance as TabsComponent<ConditionsAndZipTab>;
      tabsComponent.tabRemoved.emit(tab);

      expect(weatherServiceSpy.removeCurrentConditions).toHaveBeenCalledWith(
        tab.zip
      );
      expect(locationServiceSpy.removeLocation).toHaveBeenCalledWith(tab.zip);
    });

    it("should populate currentConditionsByZipTabs correctly", () => {
      const tabs = component.currentConditionsByZipTabs();
      expect(tabs).toHaveLength(1);

      const tab = tabs[0];
      expect(tab.isActive).toBeTruthy();
      expect(tab.title).toEqual("Name (zip)");
      expect(tab.data).toEqual(currentConditions[0].data);
    });
  });

  it("should render current conditions", () => {
    fixture.detectChanges();
    const currentConditionElement = fixture.debugElement.query(
      By.css('[data-testid="zip"]')
    );

    expect(currentConditionElement).toBeTruthy();
    expect(
      currentConditionElement.query(By.css("h3")).nativeElement.innerHTML
    ).toBe("Name (zip)");

    expect(
      (currentConditionElement.query(By.css("h4")).nativeElement as HTMLElement)
        .innerHTML
    ).toBe("Current conditions: Weather");

    const pTags = currentConditionElement.queryAll(By.css("p"));
    expect(pTags[0].nativeElement.innerHTML).toBe(
      " Current 40 - Max 60 - Min 20 "
    );

    const link = pTags[1].query(By.css("a")).nativeElement as HTMLLinkElement;

    expect(link.innerHTML).toBe("Show 5-day forecast for Name");
    expect(link.href).toBe("http://localhost/forecast/zip");

    const icon = currentConditionElement.query(By.css("img"))
      .nativeElement as HTMLImageElement;
    expect(icon.src).toBe("http://localhost/icon.png");
  });
});
