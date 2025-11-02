import {
  inject,
  Injectable,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
  signal,
  computed
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap, catchError, finalize, EMPTY } from 'rxjs';

import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';
import { IDoctorSlotsTimesResponseDto, IDoctorDurationItem } from '../dtos';
import { Logger, handleApiErrors, ApiError } from '../../../common';
import { extractDayIdFromDateString, isFutureTimeToday, isSameLocalDay } from '../../payments';

// --- Interfaces for better type safety of individual time slots ---
export interface ITimeSlot {
  start_time: string;
  end_time: string;
}

// --- State Interface ---
export interface IDoctorSlotsState {
  isLoading: boolean;
  error: string | null;
  slots: IDoctorDurationItem[]; // This holds the raw response structure
  dataSlots: ITimeSlot[]; // This will hold the flattened 'times' array
  status: boolean | null;
}

// --- Initial State ---
const initialState: IDoctorSlotsState = {
  isLoading: false,
  error: null,
  slots: [],
  dataSlots: [], // Initialize the new array
  status: null,
};

// --- TransferState Key ---
const STATE_KEY = makeStateKey<IDoctorSlotsState>('doctorSlotsState');

@Injectable({ providedIn: 'root' })
export class DoctorSlotsFacade {
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  private readonly _state = signal<IDoctorSlotsState>(initialState);

  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly slots = computed(() => this._state().slots); // Raw response
  readonly dataSlots = computed(() => this._state().dataSlots); // Flattened times
  readonly status = computed(() => this._state().status);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get(STATE_KEY, null);
      // if (cached) {
      //   this._state.set(cached);
      //   this._transferState.remove(STATE_KEY);
      // }
    }
  }

  load(doctorId: number, dayId: number, durationId: number, date?: string): void {
    this._state.update(s => ({ ...s, isLoading: true, error: null, dataSlots: [] }));

    const isToday = date ? isSameLocalDay(date) : false;
    const now = new Date();
    const actualDayId = date ? extractDayIdFromDateString(date) : dayId;

    this._apiClient.GetDoctorSlotsTimes(actualDayId ?? 0, durationId, doctorId, date)
      .pipe(
        tap((res: IDoctorSlotsTimesResponseDto) => {
          this._state.update(s => ({ ...s, status: res.status }));

          if (res.status && res.data) {
            Logger.debug('DoctorSlotsFacade => Slots Response: ', res.data);

            const flattenedTimes: ITimeSlot[] = [];

            for (const item of res.data) {
              if (!item.times || item.times.length === 0) continue;

              for (const slot of item.times) {
                const isFuture = isToday ? isFutureTimeToday(slot.start_time, now) : true;

                if (isFuture) {
                  flattenedTimes.push(slot);
                } else {
                  Logger.debug(`DoctorSlotsFacade: Skipped past slot (${slot.start_time}) for today.`);
                }
              }
            }

            Logger.debug('DoctorSlotsFacade => filtered flattenedTimes: ', flattenedTimes);

            this._state.update(s => ({
              ...s,
              slots: res.data,
              dataSlots: flattenedTimes,
              error: null
            }));

            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(STATE_KEY, this._state());
            }

            Logger.debug('DoctorSlotsFacade: Data loaded and times filtered.', this._state().dataSlots);
          } else {
            this._state.update(s => ({
              ...s,
              error: res.message ?? 'Error fetching doctor slots or no data found',
              slots: [],
              dataSlots: []
            }));
            Logger.warn('DoctorSlotsFacade: Failed to load data or data is empty.', res.message);
          }
        }),
        catchError((err: ApiError) => {
          handleApiErrors(err);
          this._state.update(s => ({
            ...s,
            error: err.message ?? 'Unknown error',
            status: false,
            slots: [],
            dataSlots: []
          }));
          Logger.error('DoctorSlotsFacade: API error occurred.', err);
          return EMPTY;
        }),
        finalize(() => {
          this._state.update(s => ({ ...s, isLoading: false }));
        })
      )
      .subscribe();
  }

  reset(): void {
    this._state.set(initialState);
  }
}
