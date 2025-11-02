import { TranslationsFacade } from '../../../../common/core/translations/services';
import { Component, computed, EventEmitter, inject, Input, Output, PLATFORM_ID, signal, OnInit } from '@angular/core';
import { IArticle } from '../../dtos';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LanguageService, Logger, StorageService } from '../../../../common';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { FavoriteArticlesFacade, ToggleFavoriteArticleFacade } from '../../services';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { RoleGuardService, UserContextService } from '../../../authentication';
import { StorageKeys } from '../../../../shared';
import { Router } from '@angular/router';
import { ArticlesRoutesEnum } from '../../constants';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    LazyLoadImageDirective,
    AutoExactHeightDirective,

    
  ],
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss']
})
export class ArticleDetailsComponent implements OnInit {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  protected readonly _LanguageService = inject(LanguageService);
  protected readonly currentLang = this._LanguageService.getCurrentLanguage();

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _RoleGuardService = inject(RoleGuardService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _Router = inject(Router);

  // ----- Computed Signals -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  public readonly isLoggedIn = computed(() => {
    if (!this.isBrowser) return false;
    return !!this.token();
  });

  // Inject the ToggleFavoriteArticleFacade
  protected readonly toggleFavoriteArticleFacade = inject(ToggleFavoriteArticleFacade);
  private favoriteArticlesFacade = inject(FavoriteArticlesFacade);

  protected isToggleLoading = computed(() => {
    return this.item && this.toggleFavoriteArticleFacade.loadingArticleIds().has(this.item.id);
  });

  @Input() data!: { article: IArticle };
  protected item!: IArticle;

  @Input() isFavourited = signal(false);
  @Output() favouriteToggled = new EventEmitter<IArticle>();
  @Output() openPopupAction = new EventEmitter<void>();

  protected sanitizedDescription: SafeHtml = '';
  private sanitizer: DomSanitizer = inject(DomSanitizer);


  protected handleFavouriteToggle(event: Event): void {
    event.stopPropagation();

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    if (!this.item || this.isToggleLoading()) {
      Logger.debug('Attempted to toggle favorite on invalid item or while already loading.');
      return;
    }

    Logger.debug('Toggling favorite status for article ID:', this.item.id);

    this.toggleFavoriteArticleFacade.toggleArticleFavorite(this.item.id)
      .subscribe({
        next: () => {
          Logger.debug(`Favorite toggle for article ${this.item.id} request completed.`);
          this.favouriteToggled.emit(this.item);
          this.item.is_bookmark = !this.item.is_bookmark;
          this.isFavourited.set(this.item.is_bookmark);
          this.favoriteArticlesFacade.fetchFavoriteArticles()
        },
        error: () => {
          Logger.error(`Favorite toggle for article ${this.item.id} failed, reverting UI.`);
        }
      });
  }

  ngOnInit(): void {
    this.item = this.data?.article;
    this.isFavourited.set(this.item.is_bookmark);
    Logger.debug('ArticleDetailsComponent => Item: ', this.item);
    this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.item?.description || '');

    if (this.isBrowser) {
      this.setUpFetchDataAfterLogin();
    }
  }

  protected refreshLoginStatus(): void {
    const newToken = this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null;
    this.token.set(newToken);
    Logger.debug('ArticleDetailsComponent: Login status refreshed, isLoggedIn:', this.isLoggedIn());
  }

  private setUpFetchDataAfterLogin(): void {
    this.refreshLoginStatus();
    this._UserContextService.recallUserDataViewed
      .subscribe((emitted: boolean) => {
        const currentUrl = this._Router.url;
        Logger.debug('ArticleDetailsComponent | currentUrl:', currentUrl);
      });
  }
}

