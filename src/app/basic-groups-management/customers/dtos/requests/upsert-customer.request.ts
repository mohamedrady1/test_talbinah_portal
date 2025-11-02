// import { IMoney } from '../../../../common';

export interface IUpsertCustomerRequest {
  id?: string;
  providerServiceId: string;
  providerEntityId?: string;
  // price: IMoney;
  price: any;
  currency?: string;
  amount?: number;
}
