import {
  inject,
  Injectable,
  signal,
  computed,
  PLATFORM_ID,
  makeStateKey,
  TransferState
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { Logger, ApiError, handleApiErrors, IApiResponse, IGlobalDoctorContactInfoModel } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';
import { BookAppointmentApiClientProvider } from '../clients';

// SSR key
const DOCTOR_DETAILS_STATE_KEY = makeStateKey<DoctorDetailsState>('doctorDetails');

// State model
interface DoctorDetailsState {
  isLoading: boolean;
  errorMessage: string | null;
  doctor: IGlobalDoctorContactInfoModel | null;
  status: boolean;
}

const initialDoctorDetailsState: DoctorDetailsState = {
  isLoading: false,
  errorMessage: null,
  doctor: null,
  status: false
};

@Injectable({ providedIn: 'root' })
export class DoctorDetailsFacade {
  // Dependencies
  private readonly _client = inject(BookAppointmentApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localization = inject(LocalizationService);
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  // Reactive state
  private readonly _doctorDetailsState = signal<DoctorDetailsState>(initialDoctorDetailsState);

  // Computed selectors
  readonly doctor = computed(() => this._doctorDetailsState().doctor);
  readonly isLoading = computed(() => this._doctorDetailsState().isLoading);
  readonly errorMessage = computed(() => this._doctorDetailsState().errorMessage);
  readonly fetchStatus = computed(() => this._doctorDetailsState().status);

  constructor() {
    this._initFromTransferState();
  }

  private _initFromTransferState(): void {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get<DoctorDetailsState>(DOCTOR_DETAILS_STATE_KEY, initialDoctorDetailsState);
      // if (cached && cached.doctor) {
      //   Logger.debug('[DoctorDetailsFacade] Hydrating from TransferState:', cached);
      //   this._updateDoctorDetailsState(cached);
      //   this._transferState.remove(DOCTOR_DETAILS_STATE_KEY);
      // }
    }
  }

  fetchDoctorDetails(doctorId: number): void {
    Logger.debug(`[DoctorDetailsFacade] Fetching doctor with ID ${doctorId}`);
    this._updateDoctorDetailsState({ isLoading: true, errorMessage: null });

    this._client.getByDoctorId(doctorId).pipe(
      tap((res: IApiResponse<IGlobalDoctorContactInfoModel>) => {
        if (res.status && res.data) {
          this._updateDoctorDetailsState({
            doctor: res.data,
            status: true,
            errorMessage: null
          });

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(DOCTOR_DETAILS_STATE_KEY, this._doctorDetailsState());
            Logger.debug('[DoctorDetailsFacade] Stored doctor details in TransferState for SSR');
          }
        } else {
          const errorMsg = res.message || this._localization.translateTextFromJson('an_error_has_occurredOccurred');
          this._updateDoctorDetailsState({
            status: false,
            errorMessage: errorMsg,
            doctor: null
          });
          Logger.warn(`[DoctorDetailsFacade] API responded with error for ID ${doctorId}:`, errorMsg);
        }
      }),
      catchError((error: ApiError) => {
        const fallbackMessage = this._localization.translateTextFromJson('an_error_has_occurredOccurred');
        this._updateDoctorDetailsState({
          status: false,
          errorMessage: fallbackMessage,
          doctor: null
        });
        handleApiErrors(error);
        Logger.error(`[DoctorDetailsFacade] Network/API failure while fetching doctor ID ${doctorId}`, error);
        return EMPTY;
      }),
      finalize(() => {
        this._updateDoctorDetailsState({ isLoading: false });
      })
    ).subscribe();
  }

  resetDoctorDetailsState(): void {
    this._doctorDetailsState.set(initialDoctorDetailsState);
    Logger.debug('[DoctorDetailsFacade] Reset doctor details state.');
  }

  private _updateDoctorDetailsState(patch: Partial<DoctorDetailsState>): void {
    this._doctorDetailsState.update(state => ({
      ...state,
      ...patch
    }));
  }
}
