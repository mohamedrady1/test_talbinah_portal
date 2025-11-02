import { ALL_INPUT_TYPES, IFormInputConfig, InputIconPosition, InputIconType } from "../../../../shared";
import { Validators } from "@angular/forms";

export const OtpMethodsFormConfig: IFormInputConfig[] = [
  {
    id: 'OtpMethodSelectionTypes',
    type: ALL_INPUT_TYPES.RADIO_BUTTON,
    radioGroups: [
      { name: 'type', value: 'whatsapp', label: 'via_whatsapp', icon: 'images/icons/WhatsApp-Icon.svg', radioWidth: 'w-half' },
      { name: 'type', value: 'sms', label: 'via_sms', icon: 'images/icons/message-text.svg', radioWidth: 'w-half' }
    ],
    name: 'type',
    label: 'verification_method',
    isRequired: true,
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    validation: [
      { function: Validators.required, errorMessage: 'please_choose_verification_method' }
    ],
    enableLabelClick: true,
    stopPaste: true
  }
];
