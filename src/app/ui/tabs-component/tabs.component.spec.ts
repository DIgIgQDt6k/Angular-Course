import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppTabDirective, TabsComponent } from "./tabs.component";
import { ConditionsAndZipTab, CurrentConditions } from "../../types";
import { By } from "@angular/platform-browser";
import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "test-tabs",
  standalone: true,
  imports: [TabsComponent, AppTabDirective, CommonModule],
  template: `<app-tabs [tabs]="tabs">
    <app-tab *ngFor="let location of tabs" [attr.data-testid]="location.zip">
      <div></div>
    </app-tab>
  </app-tabs>`,
})
class TestTabsComponent {
  @Input() public tabs: ConditionsAndZipTab[];
}

describe("TabsComponent", () => {
  let component: TestTabsComponent;
  let fixture: ComponentFixture<TestTabsComponent>;

  const tabs: ConditionsAndZipTab[] = [
    {
      isActive: true,
      title: "Tab 1",
      zip: "zip",
      data: {} as CurrentConditions,
    },
    {
      isActive: false,
      title: "Tab 2",
      zip: "zip1",
      data: {} as CurrentConditions,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTabsComponent],
      declarations: [],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(TestTabsComponent);
    component = fixture.componentInstance;
    component.tabs = tabs;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit close tab when closeTab clicked", () => {
    fixture.detectChanges();

    const tabsComponent = fixture.debugElement.query(
      By.directive(TabsComponent)
    ).componentInstance as TabsComponent<ConditionsAndZipTab>;

    const removedSpy = jest.spyOn(tabsComponent.tabRemoved, "emit");

    const tabElements = fixture.debugElement.queryAll(By.css(".tabs__tab"));
    expect(tabElements).toHaveLength(2);

    const tabElement = tabElements[0];
    expect(tabElement.query(By.css(".tab--active"))).toBeTruthy();

    expect(
      tabElement.query(By.css(".tab__content")).nativeElement.innerHTML
    ).toBe("Tab 1");

    (
      tabElement.query(By.css(".tab__close")).nativeElement as HTMLButtonElement
    ).click();
    expect(removedSpy).toHaveBeenCalledWith(tabs[0]);
  });

  it("should change tab active when tab clicked", () => {
    fixture.detectChanges();
    fixture.detectChanges();

    const tabElements = fixture.debugElement.queryAll(By.css(".tabs__tab"));
    expect(tabElements).toHaveLength(2);

    const tabElement = tabElements[1];
    expect(tabElement.query(By.css(".tab--active"))).toBeFalsy();

    expect(
      fixture.debugElement.query(By.css('[data-testid="zip1"]')).classes
    ).toEqual({ "tab-hidden": true });

    tabElement.nativeElement.click();

    fixture.detectChanges();
    expect(tabElement.query(By.css(".tab--active"))).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('[data-testid="zip1"]')).classes
    ).toEqual({ "tab-visible": true });

    expect(
      tabElement.query(By.css(".tab__content")).nativeElement.innerHTML
    ).toBe("Tab 2");
  });
});
