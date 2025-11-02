import { FormGroup } from "@angular/forms";

// 🔹 Optional Button for Actions
export interface IOptionalButtonConfig {
  label: string;
  class?: string;
  onClick?: (formGroup?: FormGroup) => void;
}
