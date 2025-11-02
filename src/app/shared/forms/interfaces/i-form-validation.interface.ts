import { ValidatorFn } from "@angular/forms";

// 🔹 Validation Structure
export interface IFormValidation {
  function: ValidatorFn;
  errorMessage: string;
  errorName?: string;
}

export interface IValidationErrors {
  [fieldName: string]: string[];
}

