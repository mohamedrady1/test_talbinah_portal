import {
  Injectable,
  PLATFORM_ID,
  inject,
  makeStateKey,
  TransferState,
  signal,
  computed
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { Logger, handleApiErrors } from '../../../common';
import { SettingsApiClientProvider } from '../clients';
import { IDoctorTicketsResponseDto, IDoctorTicketDto } from '../dtos';
import { ITicketCreateRequestDto } from '../dtos/requests';
import { ITicketCreateResponseDto } from '../dtos/responses';

const DOCTOR_TICKETS_STATE_KEY = makeStateKey<IDoctorTicketsFeatureState>('doctorTickets');

interface IDoctorTicketsState {
  tickets: IDoctorTicketDto[];
  isLoading: boolean;
  errorMessage: string | null;
  status: boolean;
}

interface IDoctorTicketsFeatureState {
  state: IDoctorTicketsState;
}

const initialDoctorTicketsState: IDoctorTicketsFeatureState = {
  state: {
    tickets: [],
    isLoading: false,
    errorMessage: null,
    status: false
  }
};

@Injectable({ providedIn: 'root' })
export class DoctorTicketsFacade {
  private readonly _client = inject(SettingsApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _state = signal<IDoctorTicketsFeatureState>(initialDoctorTicketsState);

  readonly tickets = computed(() => this._state().state.tickets);
  readonly isLoading = computed(() => this._state().state.isLoading);
  readonly errorMessage = computed(() => this._state().state.errorMessage);
  readonly status = computed(() => this._state().state.status);

  // Doctor ticket problems signals
  private readonly _problems = signal<{ id: number; problem: string }[]>([]);
  private readonly _isLoadingProblems = signal<boolean>(false);
  private readonly _errorMessageProblems = signal<string | null>(null);
  private readonly _statusProblems = signal<boolean>(false);

  readonly problems = computed(() => this._problems());
  readonly isLoadingProblems = computed(() => this._isLoadingProblems());
  readonly errorMessageProblems = computed(() => this._errorMessageProblems());
  readonly statusProblems = computed(() => this._statusProblems());

  // Signals for ticket creation
  private readonly _isCreatingTicket = signal<boolean>(false);
  private readonly _createTicketError = signal<string | null>(null);
  private readonly _createTicketStatus = signal<boolean | null>(null);
  private readonly _createTicketResponse = signal<ITicketCreateResponseDto | null>(null);

  readonly isCreatingTicket = computed(() => this._isCreatingTicket());
  readonly createTicketError = computed(() => this._createTicketError());
  readonly createTicketStatus = computed(() => this._createTicketStatus());
  readonly createTicketResponse = computed(() => this._createTicketResponse());

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      const cached = this._transferState.get<IDoctorTicketsFeatureState>(
        DOCTOR_TICKETS_STATE_KEY,
        initialDoctorTicketsState
      );
      if (cached) {
        Logger.debug('[DoctorTicketsFacade] Hydrated from TransferState');
        this._state.set(cached);
        this._transferState.remove(DOCTOR_TICKETS_STATE_KEY);
      }
    }
  }

  fetchDoctorTickets(): void {
    this._updateState({ isLoading: true, errorMessage: null });

    this._client
      .getDoctorTickets()
      .pipe(
        tap((res: IDoctorTicketsResponseDto) => {
          const newState: IDoctorTicketsState = {
            tickets: res.data ?? [],
            status: res.status,
            isLoading: false,
            errorMessage: res.status ? null : res.message ?? 'تعذر تحميل الشكاوى'
          };

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(DOCTOR_TICKETS_STATE_KEY, { state: newState });
          }

          this._state.set({ state: newState });
        }),
        catchError((err) => {
          Logger.error('[DoctorTicketsFacade] Failed to fetch tickets', err);
          this._updateState({
            tickets: [],
            isLoading: false,
            errorMessage: 'حدث خطأ أثناء تحميل الشكاوى'
          });
          handleApiErrors(err);
          return EMPTY;
        }),
        finalize(() => {
          this._updateState({ isLoading: false });
        })
      )
      .subscribe();
  }

  fetchDoctorTicketProblems(): void {
    this._isLoadingProblems.set(true);
    this._errorMessageProblems.set(null);
    this._client.getDoctorTicketProblems()
      .pipe(
        tap((res: { status: boolean; message: string | null; data: { id: number; problem: string; }[] }) => {
          this._problems.set(res.data ?? []);
          this._statusProblems.set(res.status);
          this._errorMessageProblems.set(res.status ? null : res.message ?? 'تعذر تحميل المشاكل');
        }),
        catchError((err) => {
          Logger.error('[DoctorTicketsFacade] Failed to fetch doctor ticket problems', err);
          this._problems.set([]);
          this._statusProblems.set(false);
          this._errorMessageProblems.set('حدث خطأ أثناء تحميل المشاكل');
          handleApiErrors(err);
          return EMPTY;
        }),
        finalize(() => {
          this._isLoadingProblems.set(false);
        })
      )
      .subscribe();
  }

  createTicket(payload: ITicketCreateRequestDto) {
    this._isCreatingTicket.set(true);
    this._createTicketError.set(null);
    this._createTicketStatus.set(null);
    this._createTicketResponse.set(null);
    return this._client.createTicket(payload).pipe(
      tap((res: ITicketCreateResponseDto) => {
        this._createTicketResponse.set(res);
        this._createTicketStatus.set(res.status);
        this._createTicketError.set(res.status ? null : res.message ?? 'تعذر إرسال الشكوى');
      }),
      catchError((err) => {
        Logger.error('[DoctorTicketsFacade] Failed to create ticket', err);
        this._createTicketResponse.set(null);
        this._createTicketStatus.set(false);
        this._createTicketError.set('حدث خطأ أثناء إرسال الشكوى');
        handleApiErrors(err);
        return EMPTY;
      }),
      finalize(() => {
        this._isCreatingTicket.set(false);
      })
    );
  }

  private _updateState(updates: Partial<IDoctorTicketsState>) {
    this._state.update((prev) => ({
      state: {
        ...prev.state,
        ...updates
      }
    }));
  }
}
