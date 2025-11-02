import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { PopupService } from './service/popup.service';

@Component({
  selector: 'app-form-popup',
  standalone: true,
  imports: [CommonModule, DropdownModule, MultiSelectModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './form-popup.component.html',
  styleUrls: ['./form-popup.component.scss']
})
export class FormPopupComponent implements OnInit {
  formConfig: any[] = [];
  form: FormGroup = new FormGroup({});
  popupTitle!: string;
  popupBtnTitle!: string;
  @Output() submitEvent = new EventEmitter<void>();

  private popupService = inject(PopupService)
  isOpen$ = this.popupService.isOpen$;
  isLoading$ = this.popupService.isLoading$

  ngOnInit() {
    this.popupService.formConfig$.subscribe(config => {
      this.formConfig = config.fields;
      this.popupTitle = config.popupTitle;
      this.popupBtnTitle = config.popupBtnTitle;
      this.initializeForm();
    });
  }

  initializeForm() {
    if (!this.form) {
      this.form = new FormGroup({});
    }

    this.formConfig.forEach((field) => {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.minLength) validators.push(Validators.minLength(field.minLength));
      if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));

      if (!this.form.contains(field.name)) {
        this.form.addControl(field.name, new FormControl(field.value || '', validators));
      } else {
        this.form.get(field.name)?.patchValue(field.value || '');
      }
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitEvent.emit(this.form.value);
  }

  closePopup() {
    this.popupService.closePopup();
  }
}
