import { ALL_INPUT_TYPES, IFormInputConfig, InputIconPosition, InputIconType } from "../../../shared";
import { Validators } from "@angular/forms";
import { avatars, interests } from "../data";

export const societyModeFormConfig: IFormInputConfig[] = [

  {
    id: 'societyAvatar2',
    type: ALL_INPUT_TYPES.MULTI_SELECT,
    inputWithIcon: true,
    inputIconType: InputIconType.IMAGE,
    inputIcon: 'images/icons/password.svg',
    inputIconPosition: InputIconPosition.START,
    listValues: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ],
    optionLabel: 'label',
    optionValue: 'value',
    name: 'yourName2',
    label: 'كيف تحب تظهر قدام مجتمع تلبينة؟',
    placeholder: 'اختر اي اسم مناسب لك',
    isRequired: true,
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    validation: [
      { function: Validators.required, errorMessage: ' الرجاء اختيار صورة تمثلك' }
    ],
    enableLabelClick: true
  },

  {
    id: 'societyAvatar',
    type: ALL_INPUT_TYPES.SELECT,
    inputWithIcon: true,
    inputIconType: InputIconType.IMAGE,
    inputIcon: 'images/icons/password.svg',
    inputIconPosition: InputIconPosition.START,
    listValues: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ],
    optionLabel: 'label',
    optionValue: 'value',
    name: 'yourName',
    label: 'كيف تحب تظهر قدام مجتمع تلبينة؟',
    placeholder: 'اختر اي اسم مناسب لك',
    isRequired: true,
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    validation: [
      { function: Validators.required, errorMessage: ' الرجاء اختيار صورة تمثلك' }
    ],
    enableLabelClick: true
  },

  {
    id: 'societyDefaultName',
    type: ALL_INPUT_TYPES.TEXT,
    name: 'defaultName',
    label: 'societyMode.password',
    isRequired: true,
    placeholder: 'societyMode.enter_password',
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    inputWithIcon: true,
    inputIconType: InputIconType.IMAGE,
    inputIcon: 'images/icons/password.svg',
    inputIconPosition: InputIconPosition.START,
    globalClass: 'custom-input-wrapper',
    inputClass: 'form-control',
    showConfirm: true,
    validation: [
      { function: Validators.required, errorMessage: 'societyMode.enter_confirm_password' },
    ],
    enableLabelClick: true,
    stopPaste: true,
  },
  {
    id: 'societyAvatar',
    type: ALL_INPUT_TYPES.RADIO_BUTTON,
    radioGroups: avatars,
    name: 'avatar-type',
    label: 'كيف تحب تظهر قدام مجتمع تلبينة؟',
    isRequired: true,
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    validation: [
      { function: Validators.required, errorMessage: ' الرجاء اختيار صورة تمثلك' }
    ],
    enableLabelClick: true
  },
  {
    id: 'societyInterest',
    type: ALL_INPUT_TYPES.CHECK_BOX,
    checkGroups: interests,
    inputIconPosition: InputIconPosition.START,
    name: 'interest',
    label: 'ما هي اهتماماتك ؟',
    isRequired: true,
    defaultValue: null,
    // defaultValue: ['1'],
    isDisabled: false,
    widthClass: 'w-full',
    validation: [
      { function: Validators.required, errorMessage: 'الرجاء اختيار اهتمام واحد على الأقل' }
    ],
    enableLabelClick: true
  }
];
