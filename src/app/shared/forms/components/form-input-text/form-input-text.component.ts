import { ReactiveFormsModule, FormsModule, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Logger } from '../../../../common/core/utilities/logging/logger';
import { ALL_INPUT_TYPES, InputIconType } from '../../enums';
import { TranslateModule } from '@ngx-translate/core';
import { Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { IFormInputConfig } from '../../models';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-form-input-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './form-input-text.component.html',
  styleUrls: ['./form-input-text.component.scss']
})
export class FormInputTextComponent {
  private readonly _platformId = inject(PLATFORM_ID);

  isPasswordVisible: boolean = false;
  confirmControl = new FormControl('', [Validators.required]);

  maxDate: string | null = null;

  @Input() formItem: IFormInputConfig = {
    type: ALL_INPUT_TYPES.TEXT,
    name: '',
    defaultValue: '',
  };

  @Input() control: FormControl = new FormControl();
  @Input() name: string = '';
  @Input() inputClass?: string;
  InputIconType = InputIconType;
  InputType = ALL_INPUT_TYPES;

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId) && this.formItem.type === ALL_INPUT_TYPES.DATE && this.formItem.maxValue) {
      this.setMaxDate(this.formItem.maxValue);
    }

    Logger.debug('FormInputPasswordComponent initialized with formItem:', this.formItem);
    if (this.formItem.type === this.InputType.PASSWORD && this.formItem.showConfirm) {
      this.control.valueChanges.subscribe(() => {
        this.confirmControl.updateValueAndValidity();
      });

      this.confirmControl.setValidators([
        Validators.required,
        this.matchPasswordValidator.bind(this)
      ]);
    }
  }

  private setMaxDate(maxValue: number) {
    const today = new Date();
    today.setFullYear(today.getFullYear() - maxValue); // subtract 18 years
    this.maxDate = today.toISOString().split('T')[0]; // format YYYY-MM-DD
  }

  // ✅ Dynamically set role attribute based on input type
  get roleAttr(): string {
    const type = this.formItem?.type?.toLowerCase();
    return type === 'password' ? 'password' : 'textbox';
  }

  // ✅ Dynamically set autocomplete attribute based on input type
  get autocompleteAttr(): string {
    const type = this.formItem?.type?.toLowerCase();
    return type === ALL_INPUT_TYPES.TEXT ? 'name' :
      type === ALL_INPUT_TYPES.EMAIL ? 'email' :
        type === ALL_INPUT_TYPES.PASSWORD ? 'current-password' :
          'off';
  }

  get isInvalid(): boolean {
    const control = this.control;
    return !!(
      control &&
      control.invalid &&
      (control.touched || control.dirty)
    );
  }

  get passwordMismatchError(): boolean {
    return (this.control?.parent?.hasError('passwordMismatch') ?? false) &&
      this.name === 'confirmPassword' &&
      (this.control.touched || this.control.dirty);
  }

  // ✅ Aria-label for accessibility
  get ariaLabel(): string {
    return this.formItem?.label ?? `Input field for ${this.name.replace(/[-_]/g, ' ')}`;
  }

  // ✅ Placeholder handling with fallback
  get placeholderText(): string {
    if (this.formItem?.type === ALL_INPUT_TYPES.DATE) {
      return 'xx-xx-xxx2';  // custom placeholder for date input
    }
    return this.formItem?.placeholder ?? '';
  }

  // ✅ Disabled state handling
  get isDisabled(): boolean {
    return this.formItem?.isDisabled ?? false;
  }

  // ✅ Readonly state handling
  get isReadonly(): boolean {
    return this.formItem?.isDisabled ?? false;
  }

  // ✅ Prevent Paste state handling
  get isStopPaste(): boolean {
    return this.formItem?.stopPaste ?? false;
  }

  private matchPasswordValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === this.control.value ? null : { mismatch: true };
  }

  protected openDatePicker(input: HTMLInputElement) {
    if (!isPlatformBrowser(this._platformId)) return; // ✅ SSR guard

    try {
      // Modern browsers: Chrome, Edge, Safari
      if ((input as any).showPicker) {
        (input as any).showPicker();
      } else {
        // Fallback for Firefox
        input.focus();
      }
    } catch {
      input.focus();
    }
  }
}
