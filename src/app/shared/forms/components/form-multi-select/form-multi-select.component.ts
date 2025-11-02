import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { IFormInputConfig } from '../../models';
import { CommonModule } from '@angular/common';
import { InputIconType } from '../../enums';


@Component({
  selector: 'app-form-multi-select',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MultiSelectModule
  ],
  templateUrl: './form-multi-select.component.html',
  styleUrls: ['./form-multi-select.component.scss']
})
export class FormMultiSelectComponent {
  @Input() control!: FormControl<string | null>;
  @Input() formItem!: IFormInputConfig;

  InputIconTypes = InputIconType;

  ngOnInit(): void {
    if (!this.formItem || !this.control) {
      throw new Error('Missing formItem or FormControl input.');
    }
    if (!this.formItem.listValues) {
      throw new Error('Missing formItem.listValues for single select.');
    }

    // Explicitly set control value to null if defaultValue is null
    if (!this.control.value) {
      this.control.setValue(this.formItem.defaultValue === null ? null : this.formItem.defaultValue, { emitEvent: false });
    }
  }

  onSelect(value: string): void {
    this.control.setValue(value);
    this.control.markAsDirty();
    this.control.markAsTouched();
  }

  isChecked(value: string): boolean {
    return this.control.value === value;
  }

  get ariaLabel(): string {
    return this.formItem?.label ?? `Single select group for ${this.formItem.name}`;
  }

  get showError(): boolean {
    return this.control?.invalid && (this.control.dirty || this.control.touched);
  }

  get errorMessage(): string {
    return this.formItem?.validation?.[0]?.errorMessage ?? 'الرجاء اختيار أحد الخيارات';
  }
}
