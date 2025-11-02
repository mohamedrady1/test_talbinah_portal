import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ALL_INPUT_TYPES, InputIconType } from '../../enums';
import { CommonModule, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IFormInputConfig } from '../../models';
import { SelectModule } from 'primeng/select';
import { Logger } from '../../../../common';

// Custom validator for fractional digits
function fractionDigitsValidator(minFraction: number, maxFraction: number) {
  return (control: AbstractControl) => {
    if (control.value == null) return null;
    const value = control.value.toString();
    const decimalPart = value.split('.')[1];
    const fractionLength = decimalPart ? decimalPart.length : 0;
    if (fractionLength < minFraction) {
      return { minFraction: { required: minFraction, actual: fractionLength } };
    }
    if (fractionLength > maxFraction) {
      return { maxFraction: { allowed: maxFraction, actual: fractionLength } };
    }
    return null;
  };
}

@Component({
  selector: 'app-form-input-number',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SelectModule
  ],
  providers: [DecimalPipe],
  templateUrl: './form-input-number.component.html',
  styleUrls: ['./form-input-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInputNumberComponent {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly decimalPipe = inject(DecimalPipe);

  @Input() formItem: IFormInputConfig = {
    type: ALL_INPUT_TYPES.NUMBER,
    name: '',
    defaultValue: '',
  };
  @Input() control: FormControl = new FormControl();
  @Input() name: string = '';
  @Input() inputClass?: string;

  // Signal to store control errors
  errors = signal<Record<string, any> | null>(null);

  InputIconType = InputIconType;

  ngOnInit(): void {
    Logger.debug('FormInputNumberComponent initialized with formItem:', this.formItem);
    this.applyValidators();
    this.initializeErrors();
    // Subscribe to control changes to update errors
    this.control.statusChanges.subscribe(() => {
      this.updateErrors();
    });
  }

  private applyValidators(): void {
    const validators = [];
    if (this.formItem.isRequired) {
      validators.push(Validators.required);
    }
    if (this.formItem.minValue != null) {
      validators.push(Validators.min(this.formItem.minValue));
    }
    if (this.formItem.maxValue != null) {
      validators.push(Validators.max(this.formItem.maxValue));
    }
    if (this.formItem.minFractionDigits != null || this.formItem.maxFractionDigits != null) {
      validators.push(
        fractionDigitsValidator(
          this.formItem.minFractionDigits ?? 0,
          this.formItem.maxFractionDigits ?? Infinity
        )
      );
    }
    this.control.setValidators(validators);
    this.cdr.markForCheck();
  }

  private initializeErrors(): void {
    // Initialize errors signal with current control errors
    this.errors.set(this.control.errors);
    Logger.debug('Initial control errors:', this.control.errors);
    this.cdr.markForCheck();
  }

  private updateErrors(): void {
    // Update errors signal with current control errors
    this.errors.set(this.control.errors);
    Logger.debug('Updated control errors:', this.control.errors);
    this.cdr.markForCheck();
  }

  formatNumber(event: Event): void {
    Logger.debug('Control Number: ', this.control);
    const input = event.target as HTMLInputElement;
    let value = input.valueAsNumber;

    // Reset errors signal before formatting
    this.errors.set(null);

    if (isNaN(value)) {
      this.control.setValue(null, { emitEvent: false });
      this.updateErrors();
      this.cdr.markForCheck();
      return;
    }

    // Format with DecimalPipe if fraction digits are specified
    if (this.formItem.minFractionDigits != null || this.formItem.maxFractionDigits != null) {
      const formatted = this.decimalPipe.transform(
        value,
        `1.${this.formItem.minFractionDigits ?? 0}-${this.formItem.maxFractionDigits ?? 5}`
      );
      if (formatted) {
        this.control.setValue(parseFloat(formatted), { emitEvent: true }); // Emit event to trigger validation
        input.value = formatted;
      }
    } else {
      this.control.setValue(value, { emitEvent: true }); // Emit event to trigger validation
    }

    // Update errors after formatting
    this.updateErrors();
    this.cdr.markForCheck();
  }

  get isInvalid(): boolean {
    const isInvalid = !!(this.control && this.control.invalid && (this.control.touched || this.control.dirty));
    if (isInvalid) {
      this.cdr.markForCheck();
    }
    return isInvalid;
  }

  get roleAttr(): string {
    const id = this.formItem?.id?.toLowerCase();
    return id ? `${id}-number` : 'textbox';
  }

  get autocompleteAttr(): string {
    return 'off';
  }

  get ariaLabel(): string {
    return this.formItem?.label ?? `Input field for ${this.name.replace(/[-_]/g, ' ')}`;
  }

  get placeholderText(): string {
    return this.formItem?.placeholder ?? '';
  }

  get isDisabled(): boolean {
    return this.formItem?.isDisabled ?? false;
  }

  get isReadonly(): boolean {
    return this.formItem?.isDisabled ?? false;
  }

  get isStopPaste(): boolean {
    return this.formItem?.stopPaste ?? false;
  }
}
