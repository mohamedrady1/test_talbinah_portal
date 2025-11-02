import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  ChangeDetectorRef,
  effect
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl, FormsModule } from '@angular/forms';
import { IFormInputConfig, ALL_INPUT_TYPES, ModalService, StorageKeys } from '../../../../shared';
import { IUser, IUserData, UserContextService } from '../../../authentication';
import { NationalIdVerificationComponent } from '../../../settings';
import { UrgentAppointmentRoutesEnum } from '../../constants';
import { Logger, NavigationIntent, NavigationService, StorageService } from '../../../../common';
import { extractDayIdFromDateString, PaymentPopupComponent, StatusInfoComponent } from '../../../payments';
import { CountriesLookupFacade } from "../../../lookups";
import { TranslateModule } from '@ngx-translate/core';
import { PatientDetailsConfig } from '../../configs';
import { CommonModule } from '@angular/common';
import { SelectModule } from "primeng/select";
import { SelectButtonModule } from 'primeng/selectbutton';
import { SessionFreeComponent } from '../../../book-appointment';
import { AppointmentsRoutesEnum, IStoreNormalPackagesReservationRequestDto, NormalPackagesReservationFacade } from '../../../appointments';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-patient-details-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    SelectModule,
    FormsModule,
    SelectButtonModule,
    TranslateApiPipe
  ],
  templateUrl: './patient-details-form.component.html',
  styleUrls: ['./patient-details-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientDetailsFormComponent {
  // Services
  private readonly _ModalService = inject(ModalService);
  private readonly fb = inject(FormBuilder);
  protected readonly cdr = inject(ChangeDetectorRef);
  private readonly _StorageService = inject(StorageService);
  protected readonly _NormalPackagesReservationFacade = inject(NormalPackagesReservationFacade);
  private readonly _CountriesLookupFacade = inject(CountriesLookupFacade);
  private readonly userContext = inject(UserContextService);
  private readonly nav = inject(NavigationService);

  // Signals
  readonly isLoading = signal(false);
  readonly isStoringLoading = signal(false);
  readonly error = signal<string | null>(null);

  // Inputs
  @Input() data?: any;
  @Input() type!: string;
  @Input() isSessionFree!: boolean;

  // Outputs
  @Output() closed = new EventEmitter<any>();

  // Config
  protected readonly formConfig: IFormInputConfig[] = PatientDetailsConfig;
  protected readonly allInputTypes = ALL_INPUT_TYPES;

  // Countries data
  readonly CountriesList = this._CountriesLookupFacade.Countries;
  readonly isLoadingCountries = this._CountriesLookupFacade.isLoading;
  readonly CountriesListErrorMessage = this._CountriesLookupFacade.errorMessage;

  // User
  protected userInfo!: IUser;

  // Form
  readonly form = this.fb.group({
    name: [null as string | null, Validators.required],
    gender: [null as string | null, Validators.required],
    age: [null as number | null, Validators.required],
    problem: [null as string | null]
  });

  constructor() {
    // 🔹 Effect to monitor reservation store status
    effect(() => {
      this.isStoringLoading.set(this._NormalPackagesReservationFacade.isStoring());

      if (!this._NormalPackagesReservationFacade.isStoring()) {
        const storeSuccess = this._NormalPackagesReservationFacade.isSuccess();
        const storeError = this._NormalPackagesReservationFacade.storingError();
        const storedNormalPackageReservation = this._NormalPackagesReservationFacade.storedNormalPackagesReservation();

        const itemNormalPackageData = {
          isStoring: false,
          storeSuccess,
          storeError,
          response: storedNormalPackageReservation
        };

        this.error.set(itemNormalPackageData.storeError);

        if (storeSuccess) {
          Logger.debug('✅ Free Appointment stored successfully.');
          this._ModalService.closeAll();
          this.openPaymentStatusInfo(itemNormalPackageData, 'normal');

          this._NormalPackagesReservationFacade.resetState();
        } else if (storeError) {
          Logger.error('❌ Failed to store Free Appointment:', storeError);
          this.openPaymentStatusInfo(itemNormalPackageData, 'normal');
          this._NormalPackagesReservationFacade.resetNormalPackagesOperationState();
        }
      }
    });
  }

  ngOnInit(): void {
    const storedUserInfo = this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO) as { user?: IUser } | null;
    if (storedUserInfo?.user) {
      this.userInfo = storedUserInfo.user;
      this.patchFormFromUserInfo();
    }
    if (this.isSessionFree) {
      this.openSessionFreeModal();
    }
  }

  private patchFormFromUserInfo(): void {
    if (!this.userInfo) return;
    const patchValue = {
      name: this.userInfo.full_name ?? null,
      gender: this.userInfo.gender !== undefined && this.userInfo.gender !== null
        ? (this.userInfo.gender === 1 ? 'female' : 'male')
        : null,
      age: this.calculateAge(this.userInfo.birth_date)
    };
    this.form.patchValue(patchValue);
  }

  private calculateAge(birthDateStr?: string): number | null {
    if (!birthDateStr) return null;
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private openSessionFreeModal(): void {
    this._ModalService.open(SessionFreeComponent, {
      inputs: {
        image: 'images/urgent-appointment/calender-2.png',
        title: 'disclaimer',
        // subtitle: 'SessionFree.Subtitle'
      },
      outputs: {
        closed: (data: { confirmed: boolean } | void) => {
          if (!data?.confirmed) this.closed.emit();
        }
      },
      width: '30%'
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    const payload = this.form.getRawValue();
    if (this.type === 'normal') {
      const normalData = {
        AppointmentData: this.data?.appointmentForm,
        packagesReservationsList: this.data?.packagesReservationsList || [],
        doctor_id: this.data?.doctor_id,
        package_id: this.data?.package_id,
        PatientDetails: payload
      };
      if (this.isSessionFree) {
        this.storeFreeReservationNow(normalData);
      } else {
        this.openSubscriptionModal(normalData);
      }
    } else {
      const urgentData = {
        AppointmentData: this.data?.appointmentForm,
        PatientDetails: payload
      };
      this.openSubscriptionModal(urgentData);
    }
  }

  private storeFreeReservationNow(AppointmentData: any): void {
    if (!AppointmentData?.AppointmentData) return;

    const payload: IStoreNormalPackagesReservationRequestDto = {
      payment_id: 5,
      start_time: AppointmentData.AppointmentData.start_time,
      end_time: AppointmentData.AppointmentData.end_time,
      day_id: extractDayIdFromDateString(AppointmentData.AppointmentData.date) ?? null,
      full_name: AppointmentData.PatientDetails.name,
      gender: AppointmentData.PatientDetails.gender === 'female' ? '0' : '1',
      problem: AppointmentData.PatientDetails.problem,
      age: AppointmentData.PatientDetails.age,
      doctor_id: AppointmentData.AppointmentData.doctor_id,
      communication_id: AppointmentData.AppointmentData.communication_id,
      duration_id: AppointmentData.AppointmentData.duration_id,
      date: AppointmentData.AppointmentData.date,
      package_id: AppointmentData.package_id ? String(AppointmentData.package_id) : null,
      sessions: []
    };

    this._NormalPackagesReservationFacade.storeNormalPackagesReservation(payload);
  }

  private openSubscriptionModal(AppointmentData: any): void {
    const currentUser = this.userContext.user()?.user || (this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO) as IUserData)?.user;

    if (currentUser?.verify_national_id === 0 && !currentUser?.national_id) {
      this._ModalService.open(NationalIdVerificationComponent, {
        inputs: {
          image: 'images/home/icons/quick-appointemnt.png',
          title: 'settings.nationalIdVerification.title',
          subtitle: 'settings.nationalIdVerification.subtitle',
          data: { item: { AppointmentData }, is_emergency: true, paymentStatus: false }
        },
        outputs: {
          closed: (data: { status: boolean, data: any }) => {
            if (data.status) {
              this.userContext.updateUserInfo(data.data);
            }
            this.openPaymentPopup(AppointmentData);
          }
        },
        width: "40%"
      });
    } else {
      this.openPaymentPopup(AppointmentData);
    }
  }

  private openPaymentPopup(AppointmentData: any): void {
    this._ModalService.open(PaymentPopupComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png',
        title: 'confirm_subscription',
        type: this.type === 'normal' ? 'normal' : UrgentAppointmentRoutesEnum.URGENT_APPOINTMENT_MAIN_PAGE,
        data: { item: { AppointmentData }, is_emergency: this.type !== 'normal', paymentStatus: false, type: this.data?.type }
      },
      outputs: { closed: () => this.closed.emit() },
      width: "40%"
    });
  }

  private openPaymentStatusInfo(item: any, type: 'normal'): void {
    const statusLabelsTexts = {
      buttonText: 'back_to_home',
      successTitle: 'NormalAppointment.appointmentSuccess',
      successSubTitle: this._NormalPackagesReservationFacade?.successMessage() ?? 'NormalAppointment.appointmentSuccessText',
      errorTitle: 'NormalAppointment.appointmentError',
      errorSubTitle: this.error() ?? 'NormalAppointment.appointmentErrorText'
    };

    this._ModalService.open(StatusInfoComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png',
        title: item?.storeSuccess ? 'subscription_confirmed' : 'subscription_faild',
        data: { item, statusLabels: statusLabelsTexts },

      },
      outputs: {
        closed: () => { }
      },
      width: '40%',
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '60rem',
    });
  }

  getFormControl(name: string): FormControl | null {
    return this.form.get(name) as FormControl;
  }

  getError(name: string): Record<string, any> | null {
    const control = this.getFormControl(name);
    return control?.invalid && control?.touched ? control.errors : null;
  }

  getValidationErrorMessage(controlName: string, validations: any[]): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors || !validations?.length) return '';

    const errorKeys = Object.keys(control.errors);
    for (const validation of validations) {
      if (validation.errorName && errorKeys.includes(validation.errorName)) {
        return validation.errorMessage;
      }

      // Handle required validator (which often lacks `errorName`)
      if (!validation.errorName && control.errors['required']) {
        return validation.errorMessage;
      }
    }

    return 'form.genericError'; // fallback
  }
}
