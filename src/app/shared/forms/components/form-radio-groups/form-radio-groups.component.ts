import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IFormInputConfig } from '../../models';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-form-radio-groups',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './form-radio-groups.component.html',
  styleUrls: ['./form-radio-groups.component.scss']
})
export class FormRadioGroupsComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() whatsappLabel!: string;
  @Input() smsLabel!: string;

  @Input() formItem!: IFormInputConfig;

  ngOnInit(): void {
    if (!this.formItem || !this.formItem.radioGroups || !this.control) {
      throw new Error('Missing formItem.radioGroups or FormControl input.');
    }
    this.formItem.radioGroups.forEach(radioGroup => {
      radioGroup.label = radioGroup.value === 'whatsapp' ? this.whatsappLabel : this.smsLabel;
    });
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
    return this.formItem?.label ?? `Radio group for ${this.formItem.name}`;
  }

  get showError(): boolean {
    return this.control?.invalid && (this.control.dirty || this.control.touched);
  }

  get errorMessage(): string {
    return this.formItem?.validation?.[0]?.errorMessage ?? 'الرجاء اختيار أحد الخيارات';
  }
}
