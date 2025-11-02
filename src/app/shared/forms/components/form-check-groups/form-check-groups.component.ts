import { InputIconPosition } from './../../enums/input-icon-position.enum';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IFormInputConfig } from '../../models';

@Component({
  standalone: true,
  selector: 'app-form-check-groups',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './form-check-groups.component.html',
  styleUrls: ['./form-check-groups.component.scss']
})
export class FormCheckGroupsComponent implements OnInit {
  @Input() control!: FormControl<string[]>;
  @Input() formItem!: IFormInputConfig;

  inputIconPositionTypes = InputIconPosition;

  ngOnInit(): void {
    if (!this.formItem?.checkGroups || !this.control) {
      throw new Error('Missing formItem.checkGroups or FormControl.');
    }

    // Ensure control value is initialized as array
    if (!Array.isArray(this.control.value)) {
      this.control.setValue([]);
    }
  }

  onSelect(value: string): void {
    const currentValue: string[] = this.control.value || [];

    const updatedValue = currentValue.includes(value)
      ? currentValue.filter(v => v !== value)
      : [...currentValue, value];

    this.control.setValue(updatedValue);
    this.control.markAsDirty();
    this.control.markAsTouched();
  }

  isChecked(value: string): boolean {
    return Array.isArray(this.control.value) && this.control.value.includes(value);
  }

  get ariaLabel(): string {
    return this.formItem?.label ?? `Check group for ${this.formItem.name}`;
  }
}
