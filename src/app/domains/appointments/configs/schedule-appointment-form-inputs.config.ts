import { ALL_INPUT_TYPES, IFormInputConfig, InputIconPosition, InputIconType } from "../../../shared";
import { Validators } from "@angular/forms";

export const ScheduleAppoitmentFormConfig: IFormInputConfig[] = [
  {
    id: 'ScheduleAppoitmentFormReason',
    type: ALL_INPUT_TYPES.SELECT,
    inputWithIcon: false,
    inputIconType: InputIconType.IMAGE,
    inputIcon: 'images/icons/password.svg',
    inputIconPosition: InputIconPosition.START,
    listValues: [],
    optionLabel: 'label',
    optionValue: 'value',
    name: 'reason',
    label: 'reschedule_reason_label',
    placeholder: 'reschedule_reason_placeholder',
    isRequired: true,
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    validation: [
      { function: Validators.required, errorMessage: 'reschedule_reason_error' }
    ],
    enableLabelClick: true
  },
  {
    id: 'ScheduleAppoitmentFormDetails',
    type: ALL_INPUT_TYPES.TEXTAREA,
    name: 'reasonDetails',
    label: 'note',
    isRequired: true,
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
      { function: Validators.required, errorMessage: 'reschedule_note_error' }
    ],
    enableLabelClick: true,
    stopPaste: true
  },
  {
    id: 'ScheduleAppoitmentFormDate',
    type: ALL_INPUT_TYPES.DATE,
    name: 'date',
    label: 'date',
    isRequired: true,
    placeholder: 'choose_date',
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
      { function: Validators.required, errorMessage: 'date_required' }
    ],
    enableLabelClick: true,
    stopPaste: true
  },
  {
    id: 'ScheduleAppoitmentFormSlots',
    type: ALL_INPUT_TYPES.SELECT_TABS,
    name: 'slots',
    label: 'available_times',
    isRequired: true,
    placeholder: 'form.availableTimes.placeholder',
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
      { function: Validators.required, errorMessage: 'form.availableTimes.errors.required' }
    ],
    enableLabelClick: true,
    stopPaste: true
  }
];
