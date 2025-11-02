import { ALL_INPUT_TYPES, IFormInputConfig, InputIconPosition, InputIconType } from "../../../../shared";
import { Validators } from "@angular/forms";

export const loginPasswordFormConfig: IFormInputConfig[] = [
    {
        type: ALL_INPUT_TYPES.PASSWORD,
        name: 'password',
        label: 'form.password.label',
        isRequired: true,
        placeholder: 'form.password.placeholder',
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
                errorMessage: 'form.password.errors.required',
            },
        ],
        enableLabelClick: true,
        stopPaste: true,
        showPassword: true,
    },
];