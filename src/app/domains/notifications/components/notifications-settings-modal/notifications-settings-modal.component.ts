import { Component, ChangeDetectionStrategy, inject, effect, EventEmitter, Output, PLATFORM_ID } from '@angular/core';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IGlobalUserContactInfoModel, Logger } from '../../../../common';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PreferredMsgChannelFacade } from '../../services';
import { TranslationsFacade } from '../../../../common/core/translations/services';
import { StorageKeys } from '../../../../shared';

type PreferredChannel = 'both' | 'sms' | 'whatsapp' | null;

@Component({
  selector: 'app-notifications-settings-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    CommonModule,

    LazyLoadImageDirective
  ],
  templateUrl: './notifications-settings-modal.component.html',
  styleUrls: ['./notifications-settings-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsSettingsModalComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }

  @Output() protected closed = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  protected facade = inject(PreferredMsgChannelFacade);

  private readonly _platformId = inject(PLATFORM_ID);

  readonly form: FormGroup = this.fb.group({
    sms: [false],
    whatsapp: [false]
  });

  protected readonly methodOptions = [
    {
      name: 'sms',
      label: 'via_sms',
      icon: 'images/icons/message-text.svg',
      description: 'sms_notification_alert'
    },
    {
      name: 'whatsapp',
      label: 'via_whatsapp',
      icon: 'images/icons/WhatsApp-Icon.svg',
      description: 'whatsapp_notifications_linked_number'
    }
  ];

  constructor() {
    effect(() => {
      const loading = this.facade.isLoading();
      const response = this.facade.response();
      const errorMessage = this.facade.errorMessage();

      Logger.debug('NotificationsSettingsModalComponent => State changed:', {
        loading,
        response,
        errorMessage
      });

      // ✅ Close modal automatically when request succeeds
      if (!this.facade.isLoading() && this.facade.response()) {
        Logger.debug('Close modal automatically when request success');
        this.closed.emit();
      }
    });
  }

  ngOnInit(): void {
    const currentUserData: { token: string; user?: IGlobalUserContactInfoModel } =
      JSON.parse(this.getStoredUser() || '{}');

    Logger.debug('NotificationsSettingsModalComponent | User Data: ', currentUserData);

    const preferredChannel = currentUserData?.user?.preferred_msg_channel as PreferredChannel;

    if (preferredChannel) {
      switch (preferredChannel) {
        case 'both':
          this.form.patchValue({ sms: true, whatsapp: true });
          break;
        case 'sms':
          this.form.patchValue({ sms: true, whatsapp: false });
          break;
        case 'whatsapp':
          this.form.patchValue({ sms: false, whatsapp: true });
          break;
        default:
          this.form.patchValue({ sms: false, whatsapp: false });
          break;
      }
    }
  }

  private deriveChannelFromBooleans(sms: boolean, whatsapp: boolean): PreferredChannel {
    if (sms && whatsapp) return 'both';
    if (sms) return 'sms';
    if (whatsapp) return 'whatsapp';
    return null; // nothing selected
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const { sms, whatsapp } = this.form.value;
      const preferredChannel = this.deriveChannelFromBooleans(sms, whatsapp);

      Logger.debug('NotificationsSettingsModalComponent => Derived Preferred Channel:', preferredChannel);

      this.facade.updatePreferredMsgChannel(preferredChannel);
    } else {
      Logger.warn('Form is invalid. Cannot update preferred channel.');
    }
  }

  private getStoredUser(): string | null {
    if (!isPlatformBrowser(this._platformId)) return null;
    try {
      return localStorage.getItem(StorageKeys.CURRENT_USER_INFO);
    } catch {
      return null;
    }
  }

  ngOnDestroy(): void {
    this.facade.resetPreferredMsgChannel();
  }
}

