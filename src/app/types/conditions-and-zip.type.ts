import { CurrentConditions } from "./current-conditions.type";
import { Tab } from "./tab.type";

export interface ConditionsAndZip {
  zip: string;
  data: CurrentConditions;
}

export interface ConditionsAndZipTab extends Tab, ConditionsAndZip {}
