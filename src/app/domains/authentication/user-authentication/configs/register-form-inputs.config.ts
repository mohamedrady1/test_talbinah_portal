import { ALL_INPUT_TYPES, IFormInputConfig, InputIconPosition, InputIconType, maxAgeValidator } from "../../../../shared";
import { Validators } from "@angular/forms";
import { defaultCountryCode } from "./default-country-code";

export const registerFormConfig: IFormInputConfig[] = [
  {
    id: 'registerFullName',
    type: ALL_INPUT_TYPES.TEXT,
    name: 'fullName',
    label: 'login.full_name',
    isRequired: true,
    placeholder: 'login.full_name_placeholder',
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    inputWithIcon: true,
    inputIconType: InputIconType.IMAGE,
    inputIcon: 'images/icons/profile.svg',
    inputIconPosition: InputIconPosition.START,
    globalClass: 'custom-input-wrapper',
    inputClass: 'form-control',
    validation: [
      { function: Validators.required, errorMessage: 'login.full_name_required' },
      {
        function: Validators.pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/)
        , errorMessage: 'login.full_name_pattern', errorName: 'pattern'
      }
    ],
    enableLabelClick: true,
    stopPaste: true,
  },
  {
    id: 'registerGender',
    type: ALL_INPUT_TYPES.SELECT,
    inputWithIcon: true,
    inputIconType: InputIconType.IMAGE,
    inputIcon: 'images/icons/tag-user.svg',
    inputIconPosition: InputIconPosition.START,
    listValues: [
      { value: 'male', label: 'male' },
      { value: 'female', label: 'female' }
    ],
    optionLabel: 'label',
    optionValue: 'value',
    name: 'gender',
    label: 'gender',
    placeholder: 'choose_gender',
    isRequired: true,
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    validation: [
      { function: Validators.required, errorMessage: 'gender_required' }
    ],
    enableLabelClick: true
  },
  {
    id: 'registerBirthDate',
    type: ALL_INPUT_TYPES.DATE,
    name: 'birth_date',
    label: 'form.birthDate.label',
    isRequired: true,
    placeholder: 'form.birthDate.placeholder',
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    inputWithIcon: true,
    inputIconType: InputIconType.IMAGE,
    inputIcon: 'images/layout/icons/date-icon-form.svg',
    inputIconPosition: InputIconPosition.START,
    globalClass: 'custom-input-wrapper',
    inputClass: 'form-control',
    validation: [
      { function: Validators.required, errorMessage: 'form.birthDate.errors.required' }
    ],
    maxValue: 18, // age limit, not year
    enableLabelClick: true,
    stopPaste: true,
  },
  {
    id: 'registerPhoneCode',
    type: ALL_INPUT_TYPES.COUNTRYCODEINPUT,
    countryCode: defaultCountryCode,
    name: 'phoneNumber',
    label: 'mobile_number',
    isRequired: true,
    placeholder: 'phone_placeholder',
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    inputWithIcon: true,
    inputIcon: 'images/icons/call.svg',
    inputIconType: InputIconType.IMAGE,
    inputIconPosition: InputIconPosition.START,
    globalClass: 'custom-input-wrapper',
    inputClass: 'form-control',
    validation: [
      { function: Validators.required, errorMessage: 'phone_required' },
      { function: Validators.pattern(/^[0-9]+$/), errorMessage: 'phone_pattern', errorName: 'pattern' }
    ],
    enableLabelClick: true,
    stopPaste: true
  },
  {
    id: 'registerEmail',
    type: ALL_INPUT_TYPES.EMAIL,
    name: 'email',
    label: 'login.form.email.label',
    isRequired: false,
    placeholder: 'login.form.email.placeholder',
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    inputWithIcon: true,
    inputIconType: InputIconType.IMAGE,
    inputIcon: 'images/icons/email.svg',
    inputIconPosition: InputIconPosition.START,
    globalClass: 'custom-input-wrapper',
    inputClass: 'form-control',
    validation: [
      // { function: Validators.required, errorMessage: 'login.form.email.errors.required' },
      { function: Validators.email, errorMessage: 'form.email.errors.email', errorName: 'email' },
    ],
    enableLabelClick: true,
    stopPaste: true,
  },
  {
    id: 'registerPassword',
    type: ALL_INPUT_TYPES.PASSWORD,
    name: 'password',
    label: 'login.form.password.label',
    isRequired: true,
    placeholder: 'login.form.password.placeholder',
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    inputWithIcon: true,
    inputIconType: InputIconType.IMAGE,
    inputIcon: 'images/icons/key.svg',
    inputIconPosition: InputIconPosition.START,
    globalClass: 'custom-input-wrapper',
    inputClass: 'form-control',
    showConfirm: true,
    validation: [
      { function: Validators.required, errorMessage: 'login.form.password.errors.required' },
    ],
    enableLabelClick: true,
    stopPaste: true,
    showPassword: true
  },
  // {
  //   id: 'registerConfirmPassword',
  //   type: ALL_INPUT_TYPES.PASSWORD,
  //   name: 'confirmPassword',
  //   label: 'login.form.confirmPassword.label',
  //   isRequired: true,
  //   placeholder: 'login.form.confirmPassword.placeholder',
  //   defaultValue: null,
  //   isDisabled: false,
  //   widthClass: 'w-full',
  //   inputWithIcon: true,
  //   inputIconType: InputIconType.IMAGE,
  //   inputIcon: 'images/icons/password.svg',
  //   inputIconPosition: InputIconPosition.START,
  //   globalClass: 'custom-input-wrapper',
  //   inputClass: 'form-control',
  //   showConfirm: true,
  //   validation: [
  //     { function: Validators.required, errorMessage: 'login.form.confirmPassword.errors.required' },
  //   ],
  //   enableLabelClick: true,
  //   stopPaste: true,
  // }
];
