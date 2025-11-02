import { IListValues } from "./i-list-based-options.interface";

// 🔹 Dynamic Data Loading
export interface IDynamicLoadConfig {
  url: string;
  type: 'get' | 'post';
  arrayAttributeName: string;
  labelKey: string;
  valueKey: string;
  params?: any;
  defaultSelect?: any;
  subData?: IListValues[];
  // loadService?: RequestBaseService;
  responseDataPrepare?: (data: any[]) => IListValues[];
}
