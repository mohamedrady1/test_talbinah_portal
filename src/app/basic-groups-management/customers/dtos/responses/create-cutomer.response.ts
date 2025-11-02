// import { IAuditableEntity, IMoney } from '../../../../common';

// export interface ICreateProviderCenterServiceResponse extends IAuditableEntity<string> {
export interface ICreateCutomerResponse {
  providerCenterId: string;
  providerServiceId: string;
  providerEntityId?: string;
  price: any;
}
