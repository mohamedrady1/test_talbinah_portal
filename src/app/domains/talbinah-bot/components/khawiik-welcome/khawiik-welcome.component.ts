import { Component, inject, signal, computed, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { KHAWIIK_WELCOME_FEATURES, KhawiikContent, KhawiikWelcomeItem } from '../../constants';
import { KhawiikVoiceTypesComponent } from '../khawiik-voice-types';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../../../shared';
import { RouterModule } from '@angular/router';
import { Logger } from '../../../../common';

@Component({
  selector: 'app-khawiik-welcome',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './khawiik-welcome.component.html',
  styleUrls: ['./khawiik-welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KhawiikWelcomeComponent {
  readonly content = signal<KhawiikContent | null>(KHAWIIK_WELCOME_FEATURES);
  readonly labelTitle = computed(() => this.content()?.welcomePage?.labelTitle ?? '');
  readonly pageTitle = computed(() => this.content()?.welcomePage?.title ?? '');
  readonly headerTitle = computed(() => this.content()?.header?.title ?? '');
  readonly headerSubtitle = computed(() => this.content()?.header?.subtitle ?? '');
  readonly items = computed<readonly KhawiikWelcomeItem[]>(() => {
    const list = this.content()?.welcomePage?.list;
    return Array.isArray(list) ? list : [];
  });

  private readonly _ModalService = inject(ModalService);
  private readonly platformId = inject(PLATFORM_ID);
  protected isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  protected onStart(): void {
    if (this.isBrowser) {

      this._ModalService.open(KhawiikVoiceTypesComponent, {
        inputs: {
          image: 'images/khawiik/khawiik-header-icon.png',
          title: 'khawiik.header.title',
          subtitle: 'khawiik.header.subtitle',
        },
        outputs: {
          closed: () => Logger.debug('KhawiikWelcomeComponent | The modal is closed')
        },
        width: '60%',
        minHeight: '30vh',
        maxHeight: '78vh',
        backgroundColor: 'linear-gradient(180deg, var(--Primary-50, #E7EBF8) 0%, #FFF 100%)',
        onCloseClick: () => {
          Logger.debug('KhawiikWelcomeComponent | onCloseClick |The modal is closed');
        }
      });
    }
  }

}
