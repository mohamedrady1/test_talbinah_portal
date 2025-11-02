import { Component, inject, signal, ElementRef, ChangeDetectionStrategy, ViewChild, effect, PLATFORM_ID, computed, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ChatInputComponent, ChatMessagesComponent, TalbinahBotRecordsComponent } from '../../components';
import { ILayoutGridHeaderConfig, PageLayoutHeaderComponent } from '../../../../shared';
import { AutoExactHeightDirective, Logger, MetadataService } from '../../../../common';
import { SiteHeaderComponent } from '../../../header';
import { IChatHistoryItemDataDto } from '../../dtos';
import { ChatHistoryFacade } from '../../services';
import { MainPageRoutesEnum } from '../../../main-page';
import { khawiiHeaderConfig } from '../../constants';

@Component({
  selector: 'app-talbinah-bot-layout',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ChatMessagesComponent,
    ChatInputComponent,
    TalbinahBotRecordsComponent,
    AutoExactHeightDirective,
    SiteHeaderComponent,
    PageLayoutHeaderComponent
  ],
  templateUrl: './talbinah-bot-layout.component.html',
  styleUrls: ['./talbinah-bot-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TalbinahBotLayoutComponent {
  readonly headerConfig: ILayoutGridHeaderConfig = khawiiHeaderConfig;

  // Dependencies
  private readonly chatHistoryFacade = inject(ChatHistoryFacade);
  private readonly metadataService = inject(MetadataService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  // Signals
  readonly isLoadingHistory = this.chatHistoryFacade.isLoading;
  readonly errorMessageHistory = this.chatHistoryFacade.errorMessage;
  readonly chatSelectedItem = signal<IChatHistoryItemDataDto | null>(null);
  readonly chatTitle = signal<string>('عنوان الشات');
  readonly isFullscreen = signal(false);
  private readonly screenWidth = signal(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Responsive items per page
  protected readonly itemsPerPage = computed(() => {
    const width = this.screenWidth();
    if (width < 640) return 1; // mobile
    if (width < 768) return 2; // tablet
    return 4; // desktop
  });

  // Responsive skeleton count
  protected readonly skeletonCount = computed(() => {
    const width = this.screenWidth();
    if (width < 640) return 1; // mobile
    if (width < 768) return 2; // tablet
    return 2; // desktop
  });

  @ViewChild('card') cardRef!: ElementRef<HTMLElement>;

  protected isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId)
    this.setSeoMeta();

    if (this.isBrowser) {
      effect(() => {
        const newTitle = this.chatSelectedItem()?.name ?? 'عنوان الشات';
        if (this.chatTitle() !== newTitle) {
          this.chatTitle.set(newTitle);
        }
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.isBrowser) {
      this.screenWidth.set(event.target.innerWidth);
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.chatHistoryFacade.fetchChatHistory();
    }
  }

  private setSeoMeta(): void {
    this.metadataService.setMetaTags({
      title: 'Talbinah Bot - Chat',
      description: 'Engage with Talbinah Bot for insightful conversations and mental health support.',
      keywords: 'chat, talbinah, bot, mental health',
      image: 'https://talbinah.com/images/chat/icons/bot.png',
      url: 'https://talbinah.com/chat',
      robots: 'index, follow',
      locale: 'en_US',
      canonical: 'https://talbinah.com/chat'
    });
  }

  protected onChatSelected(chat: IChatHistoryItemDataDto): void {
    Logger.debug('Selected chat:', chat);
    this.chatSelectedItem.set(chat);
  }

  protected goHome(): void {
    if (this.isBrowser) {
      this.router.navigate([MainPageRoutesEnum.MAINPAGE]);
    }
  }

  protected toggleFullscreen(): void {
    if (this.isBrowser) {
      const cardEl = this.cardRef?.nativeElement;
      if (!cardEl) return;
      if (!document.fullscreenElement) {
        cardEl.requestFullscreen().then(() => {
          this.isFullscreen.set(true);
        }).catch((err: any) => {
          Logger.error('Failed to enter fullscreen:', err);
          this.isFullscreen.set(false);
        });
      } else {
        document.exitFullscreen().then(() => {
          this.isFullscreen.set(false);
        });
      }
    }
  }
}
