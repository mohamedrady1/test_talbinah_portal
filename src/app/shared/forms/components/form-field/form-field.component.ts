import { ReactiveFormsModule, FormsModule, UntypedFormGroup, FormControl } from "@angular/forms";
import { FormRadioGroupsComponent } from "../form-radio-groups/form-radio-groups.component";
import { Component, Input, ChangeDetectorRef, SimpleChanges, inject } from "@angular/core";
import { Logger } from "../../../../common/core/utilities/logging/logger";
import { IFormValidation, IValidationErrors } from "../../interfaces";
import { FormSingleSelectComponent } from "../form-single-select";
import { CountryCodeInputComponent } from "../country-code-input";
import { FormInputNumberComponent } from "../form-input-number";
import { FormCheckGroupsComponent } from "../form-check-groups";
import { FormMultiSelectComponent } from "../form-multi-select";
import { FormInputTextComponent } from "../form-input-text";
import { TranslateModule } from "@ngx-translate/core";
import { IFormInputConfig } from "../../models";
import { CommonModule } from "@angular/common";
import { ALL_INPUT_TYPES } from "../../enums";
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    CountryCodeInputComponent,
    FormInputTextComponent,
    FormRadioGroupsComponent,
    FormInputNumberComponent,
    FormCheckGroupsComponent,
    FormSingleSelectComponent,
    FormMultiSelectComponent
  ],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent {

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  @Input() formItem: IFormInputConfig = {
    type: ALL_INPUT_TYPES.TEXT,
    name: ''
  };

  allInputTypes = ALL_INPUT_TYPES;

  @Input() formGroup: UntypedFormGroup = new UntypedFormGroup({});
  @Input() validationErrors: IValidationErrors = {};

  ngAfterContentChecked() {
    // Logger.debug('Country Code: ', this.selectedCountry());
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Logger.debug('Changes detected:', changes);
  }

  protected getFormControl(controlName: string | undefined): FormControl {
    return controlName && this.formGroup.get(controlName) instanceof FormControl
      ? (this.formGroup.get(controlName) as FormControl)
      : new FormControl('');
  }

  protected getError(formItem: IFormInputConfig): string {
    let error = '';
    const controller = this.formGroup.get(formItem.name);

    if (controller?.touched && controller.invalid) {
      const allErrors = controller.errors;
      formItem.validation?.forEach((validation: IFormValidation) => {
        if (allErrors && (allErrors[validation.function.name] || allErrors[validation.errorName ?? '']) && !error) {
          error = validation.errorMessage;
        }
      });
    }

    if (this.validationErrors?.[formItem?.name]) {
      error += ' ' + this.validationErrors[formItem?.name].join(' , ');
    }

    return error;
  }
  protected onRadioButtonSelected(selectedValue: string): void {
    this.formGroup.get('type')?.setValue(selectedValue);
  }
}


