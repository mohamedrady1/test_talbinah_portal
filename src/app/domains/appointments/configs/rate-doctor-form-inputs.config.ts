import { ALL_INPUT_TYPES, IFormInputConfig, InputIconPosition, InputIconType } from "../../../shared";
import { Validators } from "@angular/forms";

export const RateDoctorFormConfig: IFormInputConfig[] = [
  {
    id: 'RateDoctorFormRate',
    type: ALL_INPUT_TYPES.RATE,
    name: 'rate',
    label: 'form.rate.label',
    hideLabel: true,
    isRequired: true,
    placeholder: 'form.rate.placeholder',

    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    inputWithIcon: false,
    inputIconType: InputIconType.IMAGE,
    inputIcon: 'images/icons/profile.svg',
    inputIconPosition: InputIconPosition.START,
    globalClass: 'custom-input-wrapper',
    inputClass: 'form-control',
    validation: [
      { function: Validators.required, errorMessage: 'form.rate.errors.required' }
    ],
    enableLabelClick: true,
    stopPaste: true
  },
  {
    id: 'RateDoctorFormDetails',
    type: ALL_INPUT_TYPES.TEXTAREA,
    name: 'rate_text',
    label: 'form.sessionComment.label',
    isRequired: true,
    placeholder: 'form.sessionComment.placeholder',
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    inputWithIcon: false,
    inputIconType: InputIconType.IMAGE,
    inputIcon: 'images/icons/profile.svg',
    inputIconPosition: InputIconPosition.START,
    globalClass: 'custom-input-wrapper',
    inputClass: 'form-control',
    validation: [
      { function: Validators.required, errorMessage: 'form.sessionComment.errors.required' }
    ],
    enableLabelClick: true,
    stopPaste: true
  }
];
