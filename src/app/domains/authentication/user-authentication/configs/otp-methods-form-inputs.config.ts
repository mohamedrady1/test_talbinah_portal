import { ALL_INPUT_TYPES, IFormInputConfig, InputIconPosition, InputIconType } from "../../../../shared";
import { Validators } from "@angular/forms";

export const OtpMethodsFormConfig: IFormInputConfig[] = [
  {
    id: 'OtpMethodSelectionTypes',
    type: ALL_INPUT_TYPES.RADIO_BUTTON,
    radioGroups: [
      { name: 'type', value: 'whatsapp', label: 'OtpMethodSelection.Whatsapp', icon: 'images/icons/WhatsApp-Icon.svg', radioWidth: 'w-half' },
      { name: 'type', value: 'sms', label: 'OtpMethodSelection.SMS', icon: 'images/icons/message-text.svg', radioWidth: 'w-half' }
    ],
    name: 'type',
    label: 'OtpMethodSelection.Label',
    isRequired: true,
    defaultValue: null,
    isDisabled: false,
    widthClass: 'w-full',
    validation: [
      { function: Validators.required, errorMessage: 'OtpMethodSelection.Errors.Required' }
    ],
    enableLabelClick: true,
    stopPaste: true
  }
];
