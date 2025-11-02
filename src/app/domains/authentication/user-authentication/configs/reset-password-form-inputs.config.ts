import { Validators } from "@angular/forms";
import { ALL_INPUT_TYPES, IFormInputConfig } from "../../../../shared";
import { InputIconPosition, InputIconType, PasswordMatchValidator } from "../../../../shared";

export const resetPasswordFormConfig: IFormInputConfig[] = [
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
                errorName: 'required',
                errorMessage: 'enter_confirm_password',
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
        label: 'form.re_write_confirm_password',
        isRequired: true,
        placeholder: 'form.enter_password_again',
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
                errorMessage: 'form.passwords_do_not_match',
                function: PasswordMatchValidator('password', 'confirmPassword')
            }
        ],
        enableLabelClick: true,
        stopPaste: true,
    }
];