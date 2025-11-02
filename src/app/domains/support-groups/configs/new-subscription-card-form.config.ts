import { ALL_INPUT_TYPES, IFormInputConfig, InputIconPosition, InputIconType } from "../../../shared";
import { Validators } from "@angular/forms";

export const addNewSubscriptionCardForm: IFormInputConfig[] = [
    {
        id: 'fullName',
        type: ALL_INPUT_TYPES.TEXT,
        name: 'fullName',
        label: 'اسم صاحب الكارد',
        isRequired: true,
        placeholder: 'ادخل اسم صاحب الكارد',
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
            { function: Validators.required, errorMessage: 'Name is required' },
            { function: Validators.pattern(/^[A-Za-z\s]+$/), errorMessage: 'Only letters allowed', errorName: 'pattern' }
        ],
        enableLabelClick: true,
        stopPaste: true,
    },
    {
        id: 'cardNumber',
        type: ALL_INPUT_TYPES.TEXT,
        name: 'cardNumber',
        label: 'رقم الكارد',
        isRequired: true,
        placeholder: 'ادخل رقم الكارد',
        defaultValue: null,
        isDisabled: false,
        widthClass: 'w-full',
        inputWithIcon: true,
        inputIconType: InputIconType.IMAGE,
        inputIcon: 'images/icons/card.svg',
        inputIconPosition: InputIconPosition.START,
        globalClass: 'custom-input-wrapper',
        inputClass: 'form-control',
        validation: [
            { function: Validators.required, errorMessage: 'Card number is required' },
            {
                function: Validators.pattern(/^[0-9]+$/),
                errorMessage: 'Only numbers allowed',
                errorName: 'pattern'
            }
        ],
        enableLabelClick: true,
        stopPaste: true,
    },
    {
        id: 'endDate',
        type: ALL_INPUT_TYPES.TEXT,
        name: 'endDate',
        label: 'تاريخ الانتهاء',
        isRequired: true,
        placeholder: 'MM/YY',
        defaultValue: null,
        isDisabled: false,
        widthClass: 'w-half',
        inputWithIcon: true,
        inputIconType: InputIconType.IMAGE,
        inputIcon: 'images/icons/card.svg',
        inputIconPosition: InputIconPosition.START,
        globalClass: 'custom-input-wrapper',
        inputClass: 'form-control',
        validation: [
            { function: Validators.required, errorMessage: 'End date is required' },
            {
                function: Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
                errorMessage: 'Date must be in MM/YY format',
                errorName: 'pattern'
            }
        ],
        enableLabelClick: true,
        stopPaste: true,
    },
    {
        id: 'CVV',
        type: ALL_INPUT_TYPES.TEXT,
        name: 'CVV',
        label: 'رقم CVV',
        isRequired: true,
        placeholder: 'ادخل رقم CVV',
        defaultValue: null,
        isDisabled: false,
        widthClass: 'w-half',
        inputWithIcon: true,
        inputIconType: InputIconType.IMAGE,
        inputIcon: 'images/icons/card.svg',
        inputIconPosition: InputIconPosition.START,
        globalClass: 'custom-input-wrapper',
        inputClass: 'form-control',
        validation: [
            { function: Validators.required, errorMessage: 'Card number is required' },
            {
                function: Validators.pattern(/^\d{3,4}$/),
                errorMessage: 'CVV must be 3 or 4 digits',
                errorName: 'pattern'
            }
        ],
        enableLabelClick: true,
        stopPaste: true,
    }
];
