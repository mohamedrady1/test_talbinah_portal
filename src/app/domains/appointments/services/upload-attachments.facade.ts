import {
  inject,
  Injectable,
  PLATFORM_ID,
  makeStateKey,
  TransferState,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';
import { Logger, ApiError, handleApiErrors, IApiResponse } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';
import { MeetingChatItemTypes } from '../enums';
import { handleUploadFile, inferChatItemType } from '../utils';

const UPLOAD_CHAT_FILES_STATE_KEY = makeStateKey<IUploadChatFilesState>('uploadChatFilesState');

export interface IUploadedFileMetadata {
  name: string;
  type: MeetingChatItemTypes | string; // Use MeetingChatItemTypes for known types, or string for custom types
  size: number;
  link?: string;
  videoDuration?: number;
  thumbnailVideoImage?: string;
  recorderTimer?: string | null;
}

export interface IUploadChatFilesState {
  isUploading: boolean;
  uploadSuccess: boolean;
  uploadError: string | null;
  uploadedFilesResponse: IApiResponse<string[] | null> | null;
  uploadedFilesMetadata: IUploadedFileMetadata[];
}

const initialState: IUploadChatFilesState = {
  isUploading: false,
  uploadSuccess: false,
  uploadError: null,
  uploadedFilesResponse: null,
  uploadedFilesMetadata: [],
};

@Injectable({ providedIn: 'root' })
export class UploadAttachmentsFacade {
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _toast = inject(ToastService);
  private readonly _i18n = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  private readonly _state = signal<IUploadChatFilesState>(initialState);

  readonly isUploading = computed(() => this._state().isUploading);
  readonly uploadSuccess = computed(() => this._state().uploadSuccess);
  readonly uploadError = computed(() => this._state().uploadError);
  readonly uploadedFilesResponse = computed(() => this._state().uploadedFilesResponse);
  readonly uploadedFilesMetadata = computed(() => this._state().uploadedFilesMetadata);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get(UPLOAD_CHAT_FILES_STATE_KEY, null);
      // if (cached) {
      //   this._state.set(cached);
      //   this._transferState.remove(UPLOAD_CHAT_FILES_STATE_KEY);
      // }
    }
  }

  async uploadChatFiles(reservationId: number, files: File[], isSupport?: boolean): Promise<void> {
    this._state.set({
      isUploading: true,
      uploadSuccess: false,
      uploadError: null,
      uploadedFilesResponse: null,
      uploadedFilesMetadata: [],
    });

    this._apiClient.uploadChatFiles(reservationId, files, isSupport).pipe(
      tap(async (response: IApiResponse<string[] | null>) => {
        const urls = response?.data;

        if (response?.status && Array.isArray(urls)) {
          const metadataPromises = files.map(async (file, i) => {
            const type = inferChatItemType(file);
            const uploadMeta = await handleUploadFile(file, this._platformId, response); // ✅ Pass platformId here
            const baseMeta: IUploadedFileMetadata = {
              name: file.name,
              type,
              size: file.size,
              ...uploadMeta,
            };
            return baseMeta;
          });

          const metadata = await Promise.all(metadataPromises);

          this._state.update(state => ({
            ...state,
            uploadSuccess: true,
            uploadedFilesResponse: response,
            uploadedFilesMetadata: metadata,
          }));

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(UPLOAD_CHAT_FILES_STATE_KEY, this._state());
          }

          Logger.debug('Chat files uploaded:', urls);
        } else {
          const fallback = this._i18n.translateTextFromJson('an_error_has_occurred');
          const errorMsg = response?.message || fallback;
          this.handleError({ message: errorMsg } as ApiError, fallback);
        }
      }),

      catchError((error: ApiError) => {
        this.handleError(error, 'appointments.uploadFailedGeneric');
        return EMPTY;
      }),

      finalize(() => {
        this._state.update(s => ({ ...s, isUploading: false }));
      })
    ).subscribe();
  }

  resetState(): void {
    this._state.set(initialState);
  }

  private handleError(error: ApiError, fallbackKey: string): void {
    Logger.error('Upload chat files failed:', error);
    handleApiErrors(error);

    const message = error?.message || this._i18n.translateTextFromJson(fallbackKey);

    this._toast.add({
      severity: 'error',
      summary: this._i18n.translateTextFromJson('an_error_has_occurred'),
      detail: message,
      life: 5000,
    });

    this._state.update(state => ({
      ...state,
      uploadError: message,
      uploadSuccess: false,
      uploadedFilesResponse: null,
      uploadedFilesMetadata: [],
    }));
    if (!isPlatformBrowser(this._platformId)) {
      this._transferState.set(UPLOAD_CHAT_FILES_STATE_KEY, this._state());
    }
  }
}
