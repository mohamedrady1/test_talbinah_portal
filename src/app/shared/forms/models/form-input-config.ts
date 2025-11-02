import { Input } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ILocation } from '../interfaces/i-location.interface';
import { ALL_INPUT_TYPES } from '../enums/input-types.enum';
import { IListValues } from '../interfaces/i-list-based-options.interface';
import { IChangeEffection } from '../interfaces/i-change-effection.interface';
import { IFormValidation } from '../interfaces/i-form-validation.interface';
import { IFormArrayConfig } from '../interfaces/i-form-array-config.interface';
import { IFileConfig } from '../interfaces/i-file-config.interface';
import { IOptionalButtonConfig } from '../interfaces/i.optional-button-config.interface';
import { IDynamicLoadConfig } from '../interfaces/i.dynamic-load-config.interface';
import { IListLoadConfig } from '../interfaces/i-list-load-config.interface';
import { ICustomFieldTemplate } from '../interfaces/i-custom-field-template.interface';
import { InputIconType } from '../enums';

// 🔹 Main Form Input Configuration
export interface IFormInputConfig {
  id?: string;                   // unique identifier for the input
  type: ALL_INPUT_TYPES;
  countryCode?: string | number;
  name: string;
  value?: string;
  defaultValue?: any;
  groupList?: IFormInputConfig[];
  inputWithIcon?: boolean;
  inputIcon?: string;              // e.g. 'pi pi-user'
  inputIconType?: InputIconType; // e.g. 'fontawesome' or 'primeicons' or  'image' or 'svg'
  inputIconPosition?: string;  // controls icon position
  globalClass?: string;           // wrapper class
  inputClass?: string;            // input class
  placeholder?: string;
  label?: string;
  hideLabel?: boolean;
  labelIcon?: string;
  hint?: string;
  widthClass?: string;
  fixedHint?: boolean;
  enableLabelClick?: boolean;
  stopPaste?: boolean;
  isDisabled?: boolean;
  enableAddNewBtn?: boolean;
  hasAlert?: boolean;
  alertMessage?: string;
  mobileNumberCode?: string;
  validation?: IFormValidation[];
  minValue?: number;
  maxValue?: number;
  rows?: any;
  columns?: any;
  listValues?: IListValues[] | any[];
  optionLabel?: string;
  optionValue?: string;
  listTreeValues?: TreeNode[];
  dynamicLoad?: IDynamicLoadConfig;
  listLoad?: IListLoadConfig;
  isRequired?: boolean;
  arrayConfig?: IFormArrayConfig;
  clearable?: boolean;
  hasSelectAll?: boolean;
  locations?: ILocation[];
  mode?: string;
  suffix?: string;
  useGrouping?: boolean;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  changeEffect?: IChangeEffection[];
  isSearch?: boolean;
  customFieldTemplate?: ICustomFieldTemplate;
  isUnique?: boolean;
  fileConfig?: IFileConfig;
  optionalButton?: IOptionalButtonConfig;
  hide?: boolean;
  optionalButtonName?: string;
  showPassword?: boolean;
  showConfirm?: boolean;
  radioGroups?: any[];
  checkGroups?: any[];
}
