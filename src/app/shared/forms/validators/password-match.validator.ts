// src/app/shared/forms/validators/password-match.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validator to check if two form controls have matching values.
 * Useful for password and confirm password fields.
 *
 * @param controlName1 The name of the first control (e.g., 'password').
 * @param controlName2 The name of the second control to compare against (e.g., 'confirmPassword').
 * @returns A validator function that returns null if values match, or {'passwordMismatch': true} if they don't.
 */
export function PasswordMatchValidator(controlName1: string, controlName2: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(controlName1);
    const confirmPassword = control.get(controlName2);

    // If controls don't exist, or their values are null/empty, don't validate mismatch here.
    // `Validators.required` on individual controls will handle their emptiness.
    if (!password || !confirmPassword) {
      return null;
    }

    // Set error on confirmPassword control if mismatch
    if (password.value !== confirmPassword.value) {
      // Only set error if confirmPassword is touched and has a value
      if (confirmPassword.touched && confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
      }
      return { passwordMismatch: true }; // Return error at form group level
    } else {
      // If values match and confirmPassword previously had a mismatch error, clear it
      if (confirmPassword.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
      return null; // No mismatch error
    }
  };
}
