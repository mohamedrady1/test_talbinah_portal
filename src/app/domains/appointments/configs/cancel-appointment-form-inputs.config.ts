import { ALL_INPUT_TYPES, IFormInputConfig, InputIconPosition, InputIconType } from "../../../shared";
import { Validators } from "@angular/forms";

export const CancelAppoitmentFormConfig: IFormInputConfig[] = [
  {
    id: 'CancelAppoitmentFormReason',
    type: ALL_INPUT_TYPES.SELECT,
    inputWithIcon: false,
    inputIconType: InputIconType.IMAGE,
    inputIcon: 'images/icons/password.svg',
    inputIconPosition: InputIconPosition.START,
    listValues: [],
    optionLabel: 'label',
    optionValue: 'value',
    name: 'reason',
    label: 'confirm_cancellation_reason_label',
    placeholder: 'reschedule_reason_placeholder',
    isRequired: true,
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    validation: [
      { function: Validators.required, errorMessage: 'confirm_cancellation_reason_error' }
    ],
    enableLabelClick: true
  },
  {
    id: 'CancelAppoitmentFormDetails',
    type: ALL_INPUT_TYPES.TEXTAREA,
    name: 'reasonDetails',
    label: 'confirm_cancellation_reason_details_label',
    isRequired: false,
    placeholder: 'reschedule_note_placeholder',
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
      { function: Validators.required, errorMessage: 'reschedule_note_placeholder' }
    ],
    enableLabelClick: true,
    stopPaste: true
  }
];
