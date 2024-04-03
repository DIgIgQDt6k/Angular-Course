import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LocationService } from "../../services";
import { ZipcodeEntryComponent } from "./zipcode-entry.component";
import { BrowserModule, By } from "@angular/platform-browser";
import { CurrentConditionsComponent } from "../current-conditions/current-conditions.component";

describe("ZipCodeEntryComponent", () => {
  let component: ZipcodeEntryComponent;
  let fixture: ComponentFixture<ZipcodeEntryComponent>;

  let locationServiceSpy: Partial<LocationService>;

  beforeEach(async () => {
    locationServiceSpy = {
      addLocation: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BrowserModule],
      declarations: [CurrentConditionsComponent],
      providers: [{ provide: LocationService, useValue: locationServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ZipcodeEntryComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call addLocation when button clicked", () => {
    const zip = "zip";

    const input = fixture.debugElement.query(By.css("input"))
      .nativeElement as HTMLInputElement;

    const button = fixture.debugElement.query(By.css("button"))
      .nativeElement as HTMLButtonElement;

    input.value = zip;
    button.click();

    expect(locationServiceSpy.addLocation).toHaveBeenCalledWith(zip);
  });
});
