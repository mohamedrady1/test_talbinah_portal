import { IFormInputConfig } from "../models";

// 🔹 Array Configuration for Nested Groups
export interface IFormArrayConfig {
  heading: {
    label: string;
    labelClass?: string;
    buttonLabel?: string;
    buttonClass?: string;
    buttonIcon?: string;
    headingClass?: string;
  };
  itemClass?: string;
  maxRows?: number;
  alertMessage?: string;
  alertClass?: string;
  fields?: IFormInputConfig[];
  list: IFormInputConfig[][];
  defaultValues: any[];
  defaultItemValues: any;
  dynamicItemValues?: any;
  uniqueFields?: { [fieldName: string]: boolean };
}
