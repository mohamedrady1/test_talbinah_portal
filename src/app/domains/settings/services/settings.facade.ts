import {
  inject,
  Injectable,
  PLATFORM_ID,
  makeStateKey,
  TransferState,
  signal,
  computed
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import {
  ISettingMenuResponseDto,
  ISettingMenuItem
} from '../dtos';
import {
  SettingsApiClientProvider,
  ISettingsApiClient
} from '../clients';

import {
  Logger,
  ApiError,
  handleApiErrors
} from '../../../common';

const SETTINGS_STATE_KEY = makeStateKey<SettingsFeatureState>('settingsMenu');

export interface SettingsListState {
  headerItems: ISettingMenuItem[];
  profileItems: ISettingMenuItem[];
  supportItems: ISettingMenuItem[];
  appItems: ISettingMenuItem[];
  isLoading: boolean;
  errorMessage: string | null;
}

export interface SettingsFeatureState {
  settings: SettingsListState;
}

export const initialSettingsFeatureState: SettingsFeatureState = {
  settings: {
    headerItems: [],
    profileItems: [],
    supportItems: [],
    appItems: [],
    isLoading: false,
    errorMessage: null
  }
};


@Injectable({ providedIn: 'root' })
export class SettingsFacade {
  private readonly _apiClient: ISettingsApiClient = inject(SettingsApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _featureState = signal<SettingsFeatureState>(initialSettingsFeatureState);

  readonly headerItems = computed(() => this._featureState().settings.headerItems);
  readonly profileItems = computed(() => this._featureState().settings.profileItems);
  readonly supportItems = computed(() => this._featureState().settings.supportItems);
  readonly appItems = computed(() => this._featureState().settings.appItems);
  readonly isLoading = computed(() => this._featureState().settings.isLoading);
  readonly errorMessage = computed(() => this._featureState().settings.errorMessage);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get<SettingsFeatureState>(SETTINGS_STATE_KEY, initialSettingsFeatureState);
      // if (cachedState) {
      //   Logger.debug('Hydrating settings from TransferState', cachedState);
      //   this._updateSettingsState(cachedState.settings);
      //   this._transferState.remove(SETTINGS_STATE_KEY);
      // }
    }
  }

  fetchSettings(): void {
    Logger.debug('Fetching settings menu');

    this._updateSettingsState({
      isLoading: true,
      errorMessage: null
    });

    this._apiClient
      .getSettingsMenu()
      .pipe(
        tap((response: ISettingMenuResponseDto) => {
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(SETTINGS_STATE_KEY, this._featureState());
            Logger.debug('Stored settings menu in TransferState for SSR');
          }

          this._updateSettingsState({
            headerItems: response.data.header_items,
            profileItems: response.data.profile,
            supportItems: response.data.support,
            appItems: response.data.app,
            errorMessage: null
          });
          Logger.debug('Settings menu Resposne: ', {
            errorMessage: this.errorMessage(),
            headerItems: this.headerItems(),
            profileItems: this.profileItems(),
            supportItems: this.supportItems(),
            appItems: this.appItems()
          });
        }),
        catchError((error: ApiError) => {
          this._updateSettingsState({
            errorMessage: '🚨 Error loading settings. Please try again later.',
            headerItems: [],
            profileItems: [],
            supportItems: [],
            appItems: []
          });
          handleApiErrors(error);
          return EMPTY;
        }),
        finalize(() => {
          this._updateSettingsState({ isLoading: false });
        })
      )
      .subscribe();
  }

  private _updateSettingsState(updates: Partial<SettingsListState>): void {
    this._featureState.update(state => ({
      ...state,
      settings: {
        ...state.settings,
        ...updates
      }
    }));
  }
}
