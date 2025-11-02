import { ALL_INPUT_TYPES, IFormInputConfig } from "../../../../shared/forms";
import { InputIconPosition } from "../../../../shared/forms/enums/input-icon-position.enum";
import { InputIconType } from "../../../../shared/forms/enums/input-icon-type.enum";
import { Validators } from "@angular/forms";

export const loginPasswordFormConfig: IFormInputConfig[] = [
    {
        type: ALL_INPUT_TYPES.PASSWORD,
        name: 'password',
        label: 'password',
        isRequired: true,
        placeholder: 'enter_password',
        defaultValue: '',
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
            {
                function: Validators.required,
                errorMessage: 'enter_confirm_password',
            },
        ],
        enableLabelClick: true,
        stopPaste: true,
        showPassword: true,
    },
];