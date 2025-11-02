import { Validators } from "@angular/forms";
import { ALL_INPUT_TYPES, IFormInputConfig } from "../../../../shared";
import { InputIconPosition, InputIconType, PasswordMatchValidator } from "../../../../shared";

export const resetPasswordFormConfig: IFormInputConfig[] = [
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
                errorName: 'required',
                errorMessage: 'form.password.errors.required',
                function: Validators.required
            },
            {
                errorName: 'minlength',
                errorMessage: 'form.password.errors.minLength',
                function: Validators.minLength(8)
            }
        ],
        enableLabelClick: true,
        stopPaste: true,
        showPassword: true,
    },
    {
        id: 'registerConfirmPassword',
        type: ALL_INPUT_TYPES.PASSWORD,
        name: 'confirmPassword',
        label: 'form.confirmPassword.label',
        isRequired: true,
        placeholder: 'form.confirmPassword.placeholder',
        defaultValue: null,
        isDisabled: false,
        widthClass: 'w-full',
        inputWithIcon: true,
        inputIconType: InputIconType.IMAGE,
        inputIcon: 'images/icons/key.svg',
        inputIconPosition: InputIconPosition.START,
        globalClass: 'custom-input-wrapper',
        inputClass: 'form-control',
        validation: [
            {
                errorName: 'required',
                errorMessage: 'form.confirmPassword.errors.required',
                function: Validators.required
            },
            {
                errorName: 'passwordMismatch',
                errorMessage: 'form.confirmPassword.errors.mismatch',
                function: PasswordMatchValidator('password', 'confirmPassword')
            }
        ],
        enableLabelClick: true,
        stopPaste: true,
    }
];