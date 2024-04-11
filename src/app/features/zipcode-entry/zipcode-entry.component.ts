import { Component } from "@angular/core";
import { LocationService } from "../../services";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
  standalone: true,
  imports: [CommonModule],
})
export class ZipcodeEntryComponent {
  constructor(private service: LocationService) {}

  addLocation(zipcode: string) {
    this.service.addLocation(zipcode);
  }
}
