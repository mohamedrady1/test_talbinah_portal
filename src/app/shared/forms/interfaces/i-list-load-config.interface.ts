import { IListValues } from "./i-list-based-options.interface";

// 🔹 List Load Configuration
export interface IListLoadConfig {
  url: string;
  type: 'get' | 'post';
  arrayAttributeName: string;
  labelKey: string;
  valueKey: string;
  // loadService: RequestBaseService;
  params?: any;
  defaultLoadValue?: any;
  subData?: IListValues[];
  // prepareRequest?: (loadService: RequestBaseService, value: any) => void;
  responseDataPrepare?: (data: any[]) => IListValues[];
}
