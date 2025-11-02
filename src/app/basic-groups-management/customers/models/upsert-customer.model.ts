// import { IMoney } from '../../../common';

// import { IProviderCenterServiceResponse, IUpsertProviderCenterServiceRequest } from '../dtos';
// import { AllInputTypes, FormInputConfig, ListValues } from '../../../trash/shared/interfaces/form-input-config';
// import { getIdFormConfig } from '../../../views/pages/adminstration/temp-common/utils';
// import { Validators } from '@angular/forms';

// export class UpsertProviderCenterServiceModel implements IUpsertProviderCenterServiceRequest {
//   id?: string;
//   providerEntityId?: string;
//   providerServiceId: string;
//   price: IMoney;

//   constructor(request: IUpsertProviderCenterServiceRequest) {
//     this.id = request.id;
//     this.providerEntityId = request.providerEntityId;
//     this.providerServiceId = request.providerServiceId;
//     this.price = request.price;
//   }

//   static createFromItem(item: IProviderCenterServiceResponse): UpsertProviderCenterServiceModel {
//     return new UpsertProviderCenterServiceModel({
//       id: item.id,
//       providerServiceId: item.providerService.id,
//       providerEntityId: item.providerEntity?.id,
//       price: item.price
//     });
//   }

//   static create(data: IUpsertProviderCenterServiceRequest): UpsertProviderCenterServiceModel {
//     return new UpsertProviderCenterServiceModel(data);
//   }

//   static createDefault(): UpsertProviderCenterServiceModel {
//     return UpsertProviderCenterServiceModel.create({
//       price: {
//         amount: 0,
//         currency: 'None'
//       },
//       providerServiceId: ''
//     });
//   }

//   update(request: IUpsertProviderCenterServiceRequest) {
//     this.id = request.id;
//     this.providerEntityId = request.providerEntityId;
//     this.providerServiceId = request.providerServiceId;
//     this.price = request.price;
//   }

//   getFormConfig(
//     providerServices: ListValues[],
//     savedProviderServiceId: string | null,
//     providerEntities: ListValues[],
//     selectedProviderEntityId: string | null,
//     selectedCurrency: string | null,
//     selectedAmount: number | null,
//     isVisible?: boolean
//   ): FormInputConfig[] {
//     // this.providerServiceId = savedProviderServiceId || '';
//     // this.providerEntityId = selectedProviderEntityId || '';
//     // this.price.currency = selectedCurrency || 'None';
//     // this.price.amount = selectedAmount || 0;

//     return [
//       getIdFormConfig(this.id),
//       {
//         type: AllInputTypes.Select,
//         name: 'providerServiceId',
//         label: 'Provider Service',
//         widthClass: 'col-12',
//         defaultValue: this.providerServiceId,
//         isDisable: !isVisible,
//         listValues: providerServices,
//         validation: [
//           {
//             function: Validators.required,
//             errorMessage: 'Please select Provider Service'
//           }
//         ]
//       },
//       {
//         type: AllInputTypes.Select,
//         name: 'providerEntityId',
//         label: 'Provider Entity',
//         widthClass: 'col-12',
//         defaultValue: this.providerEntityId,
//         isDisable: !isVisible,
//         listValues: providerEntities
//       },
//       {
//         type: AllInputTypes.Text,
//         name: 'currency',
//         label: 'Currency',
//         placeholder: 'Ex: USD',
//         defaultValue: this.price.currency,
//         isDisable: !isVisible,
//         widthClass: 'col-12',
//         validation: [
//           {
//             function: Validators.required,
//             errorMessage: 'Please enter text'
//           },
//           {
//             function: Validators.pattern(/^[A-Za-z\s]+$/),
//             errorMessage: 'Only English characters are allowed, without numbers',
//             errorName: 'pattern'
//           }
//         ]
//       },
//       {
//         type: AllInputTypes.Number,
//         name: 'amount',
//         label: 'Amount',
//         placeholder: 'Enter a number',
//         defaultValue: this.price.amount,
//         isDisable: !isVisible,
//         widthClass: 'col-12',
//         validation: [
//           {
//             function: Validators.required,
//             errorMessage: 'Please enter a number'
//           }
//         ]
//       }
//     ];
//   }
// }
