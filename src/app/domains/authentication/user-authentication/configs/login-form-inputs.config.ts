import { ALL_INPUT_TYPES, IFormInputConfig } from "../../../../shared/forms";
import { InputIconPosition } from "../../../../shared/forms/enums/input-icon-position.enum";
import { InputIconType } from "../../../../shared/forms/enums/input-icon-type.enum";
import { defaultCountryCode } from "./default-country-code";
import { Validators } from "@angular/forms";

export const checkNumberFormConfig: IFormInputConfig[] = [
  {
    id: 'loginPhoneNumber',
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
      {
        function: Validators.required,
        errorMessage: 'phone_required'
      },
      {
        function: Validators.pattern(/^[0-9]+$/),
        errorMessage: 'phone_pattern',
        errorName: 'pattern'
      },
      {
        function: Validators.minLength(3),
        errorMessage: 'phone_min_length',
        errorName: 'minlength'
      },
      {
        function: Validators.maxLength(12),
        errorMessage: 'phone_max_length',
        errorName: 'maxlength'
      }
    ],
    enableLabelClick: true,
    stopPaste: false
  },
  // {
  //   id: 'loginPassword',
  //   type: ALL_INPUT_TYPES.PASSWORD,
  //   name: 'password',
  //   label: 'login.password',
  //   isRequired: true,
  //   placeholder: 'login.enter_password',
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
  //     { function: Validators.required, errorMessage: 'login.enter_confirm_password' },
  //   ],
  //   enableLabelClick: true,
  //   stopPaste: true,
  //   showPassword: true
  // },
  // {
  //   id: 'loginCodeConfirmation',
  //   type: ALL_INPUT_TYPES.RADIO_BUTTON,
  //   radioGroups: [
  //     { name: 'type', value: 'whatsapp', label: 'login.form.codeConfirmation.options.whatsapp', icon: 'images/icons/WhatsApp-Icon.svg', radioWidth: 'w-half' },
  //     { name: 'type', value: 'email', label: 'login.form.codeConfirmation.options.email', icon: 'images/icons/message-text.svg', radioWidth: 'w-half' }
  //   ],
  //   name: 'code-confirmation-ype',
  //   label: 'login.form.codeConfirmation.label',
  //   isRequired: true,
  //   defaultValue: null,
  //   isDisabled: false,
  //   widthClass: 'w-full',
  //   validation: [
  //     { function: Validators.required, errorMessage: 'login.form.codeConfirmation.errors.required' }
  //   ],
  //   enableLabelClick: true,
  //   stopPaste: true
  // }
];
