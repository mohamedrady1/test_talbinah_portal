import { FormsModule, ReactiveFormsModule, UntypedFormGroup, FormBuilder, FormControl, ValidatorFn, AbstractControl } from "@angular/forms";
import { Component, EventEmitter, Input, Output, SimpleChanges, inject, signal } from "@angular/core";
import { Logger } from "../../../../common/core/utilities/logging/logger";
import { IFormValidation, IValidationErrors } from "../../interfaces";
import { FormFieldComponent } from "../form-field";
import { IFormInputConfig } from "../../models";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";


@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [FormFieldComponent, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent {
  private fb: FormBuilder = inject(FormBuilder);

  @Input() formConfig: IFormInputConfig[] = [];
  @Input() formValidation: IFormValidation[] = [];
  @Input() validationErrors: IValidationErrors = {};
  @Input() hasButton: boolean = true;
  @Input() validationEmit: boolean = false;

  @Input() submitButtonText: string = 'Submit';
  @Input() resetButtonText: string = 'Reset';
  @Input() enablResetButtonText: boolean = false;
  @Input() changeSensitive: boolean = false;

  @Output() onSubmit: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();
  @Output() onChange: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();
  @Output() onReset: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();

  formGroup: UntypedFormGroup = new UntypedFormGroup({});
  formError = signal<string>('');
  isLoading = signal<boolean>(false);

  // Add New Button Emitter
  @Output() onAddNew: EventEmitter<IFormInputConfig> = new EventEmitter<IFormInputConfig>();

  ngOnInit(): void {
    this.createForm();
    this.setupAutoSubmit();
    // Logger.debug("Form Configuration:", this.formConfig);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Logger.debug("Changes detected:", changes);

    if (changes['formConfig'] && changes['formConfig'].currentValue) {
      this.createForm();
    }

    if (changes['validationEmit'] && changes['validationEmit'].previousValue !== null) {
      this.submitForm();
    }

    this.setupAutoSubmit();
  }

  private setupAutoSubmit(): void {
    if (this.changeSensitive) {
      this.formGroup.valueChanges.subscribe(() => {
        this.onChange.emit(this.formGroup.value);
      });
    }
  }

  private createForm(): void {
    this.formGroup = this.fb.group({});
    this.formConfig.forEach(field => this.addFormField(field));

    // Add custom validator for confirm password
    if (this.formGroup.contains('password') && this.formGroup.contains('confirmPassword')) {
      this.formGroup.setValidators(this.passwordMatchValidator);
    }

    this.formGroup.valueChanges.subscribe(value => this.onChange.emit(value));
  }

  private addFormField(field: IFormInputConfig): void {
    const validators: ValidatorFn[] = field.validation?.map(v => v.function) || [];
    const control = new FormControl<string | number | boolean | null>(field.defaultValue || '', { validators });

    if (field.isDisabled) {
      control.disable();
    }

    this.formGroup.addControl(field.name, control);
  }

  protected submitForm(): void {
    this.formGroup.markAllAsTouched();
    this.formError.set('');

    if (this.formGroup.valid) {
      this.isLoading.set(true);

      // Simulate async call (مثال بس، بداله حط HTTP call)
      setTimeout(() => {
        this.onSubmit.emit({ ...this.formGroup.value });
        this.isLoading.set(false); // Stop loading after emit
      }, 1500);
    } else {
      this.processValidationErrors();
    }
  }


  private processValidationErrors(): void {
    if (this.formGroup.errors) {
      const allErrors = this.formGroup.errors;
      this.formValidation.forEach((validation: IFormValidation) => {
        if (allErrors && (allErrors[validation.function.name] || allErrors[validation.errorName ?? '']) && this.formError() === '') {
          this.formError.set(validation.errorMessage);
        }
      });
    }
  }

  // protected resetForm(): void {
  //   this.formGroup.reset();
  // }
  reset(): void {
    this.onReset.emit(this.formGroup.value);
  }

  // Add New Button Function
  protected addNew(formItem: IFormInputConfig): void {
    this.onAddNew.emit(formItem);
  }

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): IValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: ['Passwords do not match'] };
  };

}
