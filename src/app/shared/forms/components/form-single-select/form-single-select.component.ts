import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IFormInputConfig } from '../../models';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { InputIconType } from '../../enums';
import { PublicService } from '../../../services';

@Component({
  selector: 'app-form-single-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectModule
  ],
  templateUrl: './form-single-select.component.html',
  styleUrls: ['./form-single-select.component.scss']
})
export class FormSingleSelectComponent implements OnInit {
  @Input() control!: FormControl<string | null>;
  @Input() formItem!: IFormInputConfig;
  private publicService = inject(PublicService)
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
  protected translatedOptions(): string[] {
    return (this.formItem.listValues || []).map(option => ({
      ...option,
      [this.formItem.optionLabel || 'label']: this.publicService.translateTextFromJson(option[this.formItem.optionLabel || 'label'])
    }));
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
