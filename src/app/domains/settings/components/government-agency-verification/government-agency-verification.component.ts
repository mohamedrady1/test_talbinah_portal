import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
  signal,
  OnInit,
  OnDestroy,
  effect,
  EventEmitter,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CodeInputComponent, ModalService, RecaptchaService } from '../../../../shared';
import { Logger, ApiError } from '../../../../common';
import { IGovernmentAgenciesVerifyOtpRequestDto, IGovernmentAgencyItemdDto } from '../../dtos';
import { UserAuthenticationApiClientProvider } from '../../../authentication';
import { IOtpVerificationRequestDto, IOtpVerificationResponseDto } from '../../../authentication/user-authentication/dtos';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GovernmentAgenciesEmailVerificationFacade, GovernmentAgenciesVerifyOtpFacade } from '../../services';
import { GovernmentAgenciesDoctorsComponent } from '../government-agencies-doctors';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-government-agency-verification',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    CodeInputComponent,
    
  ],
  templateUrl: './government-agency-verification.component.html',
  styleUrls: ['./government-agency-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GovernmentAgencyVerificationComponent implements OnInit, OnDestroy {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  @Output() public closed = new EventEmitter<{ status: boolean, data: any } | void>();

  readonly isCodeSent = signal<boolean | null>(null);
  readonly EmailSent = signal<string | null>('');
  private readonly _modalService = inject(ModalService);


  private readonly emailVerificationFacade = inject(GovernmentAgenciesEmailVerificationFacade);
  readonly isLoading = computed(() => this.emailVerificationFacade.isLoading());

  private fb = inject(FormBuilder);
  protected domain = '';

  readonly form: FormGroup = this.fb.group({
    emailPrefix: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+$/)]],
    domain: [{ value: this.domain, disabled: true }]
  });

  get emailPrefix() {
    return this.form.get('emailPrefix');
  }

  get hasError(): boolean {
    const control = this.emailPrefix;
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  // ======= Inputs =======
  @Input({ required: true }) config!: IGovernmentAgencyItemdDto;

  // ======= Injected Dependencies =======
  private readonly userAuthApi = inject(UserAuthenticationApiClientProvider).getClient();
  private readonly recaptcha = inject(RecaptchaService);

  // ======= Signals =======
  readonly recaptchaToken = signal<string | null>(null);
  readonly verifyCodeRequest = signal<IOtpVerificationRequestDto | null>(null);
  readonly verifyCodeResponse = signal<IOtpVerificationResponseDto | null>(null);
  readonly verifyCodeError = signal<ApiError | null>(null);

  private readonly otpVerificationFacade = inject(GovernmentAgenciesVerifyOtpFacade);
  readonly isOtpLoading = computed(() => this.otpVerificationFacade.isLoading());

  readonly codeLength = signal<number | string | null>(null);
  readonly clearInputs = signal(false);
  readonly codeNotValid = signal(false);
  readonly inputsNumber = 4;

  readonly isSubmitDisabled = computed(() =>
    !this.codeLength() || this.codeLength()!.toString().length < this.inputsNumber
  );

  // ======= Lifecycle =======
  constructor() {
    effect(() => {
      if (this.emailVerificationFacade.status()) {
        this.isCodeSent.set(true);
      }
    });

    effect(() => {
      const status = this.otpVerificationFacade.status();
      const error = this.otpVerificationFacade.errorMessage();

      if (status === false && error) {
        this.codeNotValid.set(true);
        this.clearInputs.set(true);
      }

      if (status === true) {
        this.otpVerificationFacade.reset();
        this.closed.emit({ status: true, data: null });
        Logger.debug('✅ OTP verified successfully. Proceed to next step or show success.');
        this.openGovernmentAgenciesDoctorsModal();
      }
    });
  }

  ngOnInit(): void {
    // this.openGovernmentAgenciesDoctorsModal();
    Logger.debug('GovernmentAgencyVerificationComponent => config:', this.config);
    this.domain = this.config?.domain || '';
    // Rebuild form after domain is known
    this.form.setControl(
      'domain',
      this.fb.control({ value: this.domain, disabled: true })
    );
  }

  ngOnDestroy(): void {
    this.recaptcha.removeScript();
    this.emailVerificationFacade.clear();
    this.otpVerificationFacade.reset();
  }

  // ======= Handlers =======
  handleCodeChange(code: number | string | null): void {
    this.codeLength.set(code);
  }

  handleCodeCompletion(code: number | string | null): void {
    this.codeLength.set(code);
    Logger.debug('handleCodeChange value:', code);
    this.codeNotValid.set(false);
    // optionally trigger verification here
  }

  // ======= Template Accessors =======
  get codeLengthValue(): number | string | null {
    return this.codeLength();
  }

  get clearInputsValue(): boolean {
    return this.clearInputs();
  }

  protected verifyCode(): void {
    const code = this.codeLength();
    Logger.debug('verifyCode emitter: ', {
      code: code,
      lengthValid: (code ? code.toString().length < this.inputsNumber : false)
    })
    if (!code || code.toString().length < this.inputsNumber) {
      this.codeNotValid.set(true);
      return;
    }

    this.codeNotValid.set(false);

    const email = this.EmailSent();
    if (!email) return;

    const payload: IGovernmentAgenciesVerifyOtpRequestDto = {
      work_email: email,
      code: code.toString()
    };

    this.otpVerificationFacade.verifyGovernmentAgenciesEmailOtp(payload);
  }



  protected submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue(); // includes disabled fields like domain
    const email = `${formValue.emailPrefix}@${this.domain}`;

    this.EmailSent.set(email);
    this.emailVerificationFacade.sendGovernmentAgenciesEmailVerification(email);
  }

  protected openGovernmentAgenciesDoctorsModal(): void {
    this._modalService.open(GovernmentAgenciesDoctorsComponent, {
      inputs: {
        image: 'images/settings/modal-icons/government-agencies.png',
        title: 'government_entities',
        subtitle: 'link_government_account',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Security Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%",
      maxHeight: "80%"
    });
  }
}

