import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, Input, Output, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { ALL_INPUT_TYPES, FormRadioGroupsComponent, IFormInputConfig, ModalService, RecaptchaService, ToastService } from '../../../../../shared';
import { IMethodSelectionParams, IMethodSelectionResponseDto } from '../../dtos';
import { ApiError, handleApiErrorsMessage, Logger } from '../../../../../common';
import { UserAuthenticationApiClientProvider } from '../../clients';
import { OtpMethodsFormConfig } from '../../configs';
import { finalize, take } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateApiPipe } from '../../../../../common/core/translations/pipes/translate-api.pipe';

@Component({
  selector: 'app-otp-method-selection',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    FormRadioGroupsComponent,
    CommonModule,
    TranslateApiPipe
  ],
  templateUrl: './otp-method-selection.component.html',
  styleUrls: ['./otp-method-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtpMethodSelectionComponent {
  private readonly userAuthApi = inject(UserAuthenticationApiClientProvider).getClient();
  private readonly modalService = inject(ModalService);
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _router = inject(Router);
  private recaptcha = inject(RecaptchaService);
  recaptchaToken = signal<string | null>(null);
  private readonly _ToastService = inject(ToastService);

  readonly isLoading = signal<boolean>(false);
  readonly methodSelectionRequest = signal<IMethodSelectionParams | null>(null);
  readonly MethodSelectionResponse = signal<IMethodSelectionResponseDto | null>(null);
  readonly methodSelectionError = signal<ApiError | null>(null);


  private readonly fb = inject(FormBuilder);

  /** ✅ Inputs from Modal Config */
  @Input() image?: string;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() data?: any;

  /** ✅ Output emitter to notify modal parent */
  @Output() closed = new EventEmitter<any>();

  // Config and constants
  protected readonly formConfig: IFormInputConfig[] = OtpMethodsFormConfig;
  protected readonly allInputTypes = ALL_INPUT_TYPES;

  // Form state
  readonly form = this.fb.group({
    type: [null, Validators.required]
  });

  // Accessors
  protected getFormControl(name: string): FormControl | null {
    return this.form.get(name) as FormControl;
  }

  protected getError(name: string): Record<string, any> | null {
    const control = this.getFormControl(name);
    return control?.invalid && control?.touched ? control.errors : null;
  }

  constructor() {
    this.setupLoginPasswordEffect();
  }

  ngOnInit(): void {
    Logger.debug('Otp Method Selection Component Initialized', {
      data: this.data
    });
  }
  // Submit logic
  protected async onOtpMethodSelectionSubmit(): Promise<void> {
    if (this.form.valid) {
      try {
        this.isLoading.set(true);
        const token = await this.recaptcha.execute('LOGIN');
        this.recaptchaToken.set(token);
        Logger.debug('reCAPTCHA token received:', token);
      } catch (err) {
        Logger.warn('Failed to fetch reCAPTCHA token', err);
        this.isLoading.set(false);
        return;
      }
      const payload = this.form.getRawValue();
      const queryParams: IMethodSelectionParams = {
        // phone_no: 1018388774,
        // country_id: 63,
        channel: payload.type ?? '',
        phone_no: this.data?.payploadCheckNumber?.phone_no ?? '',
        country_id: this.data?.payploadCheckNumber?.country_id ?? null,
        country_code: this.data?.payploadCheckNumber?.country_code ?? null,
        // country_id: removeSpecialCharacters(selectedCountry.phone_code),
        role: 'user',
        device_type: 'web',
        'g-recaptcha-response': this.recaptchaToken() ?? '',
        platform: 'portal',
        app_type: 'web'
      };
      Logger.debug('Method Selection Query Params:', queryParams);
      // Set the request signal
      this.methodSelectionRequest.set(queryParams);
    } else {
      Logger.debug('Otp Method Selection Form is invalid');
      this.form.markAllAsTouched();
    }
  }

  private setupLoginPasswordEffect(): void {
    effect(() => {
      const request = this.methodSelectionRequest();
      if (!request) return;

      this.isLoading.set(true);
      this.userAuthApi.methodSelection(request)
        .pipe(
          take(1),
          finalize(() => this.isLoading.set(false))
        )
        .subscribe({
          next: (res: IMethodSelectionResponseDto) => {
            this.MethodSelectionResponse.set(res);
            this.handleMethodSelection(res);
          },
          error: (error: ApiError) => {
            this.methodSelectionError.set(error);
            Logger.warn('Method Selection failed', error);
            handleApiErrorsMessage(error);
            this._ToastService.add({
              severity: 'error',
              summary: 'general.error',
              detail: String(error?.message ?? 'Unknown error'),
              life: 5000,
            });
          }
        });
    });
  }
  protected handleMethodSelection(res: IMethodSelectionResponseDto): void {
    Logger.debug('Handle Method Selection called', res);
    if (res.status) {
      // TODO: Add submission logic here
      this.closed.emit({
        status: true,
        data: this.methodSelectionRequest(),
        payploadCheckNumber: this.data?.payploadCheckNumber || null
      }); // ✅ emit selected data

      // Close the modal on success
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      const currentUrl = this._router.url;
      if (currentUrl === '/' || currentUrl === '/home') {
        document.body.style.overflow = '';
      }
    }
    this.recaptcha.removeScript();
  }
}
