import { FormGroup } from "@angular/forms";
import { IFormInputConfig } from "../models";

// 🔹 Custom Field Template for Advanced Components
export interface ICustomFieldTemplate {
  disableClick: boolean;
  template(formGroup?: FormGroup): string;
  handleClick?: (formItem?: IFormInputConfig, formGroup?: FormGroup) => void;
}
