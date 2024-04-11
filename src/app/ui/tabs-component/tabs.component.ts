import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  effect,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnChanges,
  Output,
  QueryList,
  Signal,
  signal,
  SimpleChanges,
  WritableSignal,
} from "@angular/core";
import { Tab } from "app/types";

@Directive({ selector: "app-tab", standalone: true })
export class AppTabDirective {
  @HostBinding("class")
  @Input()
  public visible: string;
}

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, AppTabDirective],
})
export class TabsComponent<TTab extends Tab> implements OnChanges {
  @Input({ required: true }) public tabs: TTab[] = [];
  @Output() public tabRemoved: EventEmitter<TTab> = new EventEmitter<TTab>();

  @ContentChildren(AppTabDirective)
  public tabOutlets: QueryList<AppTabDirective>;

  private readonly _activeTab: WritableSignal<TTab> = signal({} as TTab);
  public activeTab: Signal<TTab> = this._activeTab.asReadonly();

  public constructor(private readonly cdr: ChangeDetectorRef) {
    effect(() => {
      const activeTab = this.activeTab();
      const activeTabIndex = this.tabs.indexOf(activeTab);

      this.tabOutlets?.forEach((tab, index) => {
        if (index === activeTabIndex) {
          tab.visible = "tab-visible";
        } else {
          tab.visible = "tab-hidden";
        }
      });

      this.cdr.markForCheck();
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["tabs"]) {
      this._activeTab.update(() => this.tabs.find((x) => x.isActive));
    }
  }

  public closeTab(tab: TTab) {
    this.tabRemoved.emit(tab);
  }

  public selectTab(tab: TTab) {
    const tabIndex = this.tabs.indexOf(tab);
    if (tabIndex !== -1) {
      this.tabs.forEach((tab, index) => {
        tab.isActive = index === tabIndex;
      });

      this._activeTab.update(() => this.tabs.find((x) => x.isActive));
    }
  }
}
