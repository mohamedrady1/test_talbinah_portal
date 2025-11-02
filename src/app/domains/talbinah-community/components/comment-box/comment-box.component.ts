import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

import { Tab, tabComponent } from '../tab';
import { EmojiPickerComponent, StorageKeys } from '../../../../shared';
import { ClickOutsideDirective } from '../../../../common/core/directives';

import { IPost, IUserIdentifyProfileData } from '../../dtos';
import { Logger, StorageService } from '../../../../common';
import { TalbinahCommunityRoutesEnum } from '../../constants';
import { Router } from '@angular/router';
import { RoleGuardService, UserContextService } from '../../../authentication';
import { TranslateApiPipe } from '../../../../common/core/translations';
@Component({
  selector: 'app-comment-box',
  standalone: true,
  imports: [
    CommonModule,
    EmojiPickerComponent,
    ClickOutsideDirective,
    TranslateModule,
    TranslateApiPipe
  ],
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss'],
})
export class CommentBoxComponent {
  // --- Inputs ---
  @Input() userIdentityProfileData = signal<IUserIdentifyProfileData | null>(null);
  @Input() isLoadingComment = signal<boolean>(false); // SSR-safe signal input
  @Input() isActions = signal<boolean>(false); // SSR-safe signal input
  @Input() readonlyOnClick = signal<boolean>(false); // SSR-safe signal input
  @Input() placeholder = signal<string>('write_a_kind_word'); // SSR-safe signal input
  @Input() type!: string;
  // --- Outputs ---
  @Output() inputChanged = new EventEmitter<string>();
  @Output() commentSubmitted = new EventEmitter<string>();
  @Output() suggestionSelected = new EventEmitter<string>();
  @Output() inputClicked = new EventEmitter<void>();
  @Output() addReelsClicked = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('commentInput') commentInput!: ElementRef<HTMLInputElement>;

  // --- Signals ---
  public comment = signal<string>('');
  public showEmojiPicker = signal<boolean>(false);
  public isFocused = signal<boolean>(false);


  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _Router = inject(Router);

  // ----- Auth / Guest Computed -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  protected readonly isLoggedIn = computed(() => !!this.token());

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }


  // --- Handlers ---
  protected updateInput(value: string): void {
    this.comment.set(value);
    this.inputChanged.emit(value);
    Logger.debug('[CommentBox] Input changed:', value);
  }

  protected submitComment(): void {
    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }
    const value = this.comment().trim();
    if (value && !this.isLoadingComment()) {
      this.commentSubmitted.emit(value);
    }
  }

  protected onInputClick(): void {
    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }
    if (this.readonlyOnClick()) {
      this.inputClicked.emit();
    }
    this.isFocused.set(true);
  }

  protected onInputFocus(): void {
    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    this.isFocused.set(true);
  }
  protected addReels(): void {
    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    this.addReelsClicked.emit();
  }
  protected onInputBlur(): void {
    if (this.comment().length === 0 && !this.showEmojiPicker()) {
      this.isFocused.set(false);
    }
  }

  protected selectSuggestion(text: string): void {
    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    this.suggestionSelected.emit(text);
    this.comment.set(text);
    this.inputChanged.emit(text);
    this.focusInput();
  }

  protected toggleEmojiPicker(): void {
    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }
    this.showEmojiPicker.update(v => !v);
    if (this.showEmojiPicker()) {
      this.focusInput();
    }
  }

  protected onEmojiPicked(emojiChar: string): void {
    if (!this.isBrowser) return;

    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    const inputEl = this.commentInput?.nativeElement;
    if (!inputEl) return;

    const start = inputEl.selectionStart ?? 0;
    const end = inputEl.selectionEnd ?? 0;
    const current = this.comment();

    const newValue = current.slice(0, start) + emojiChar + current.slice(end);
    this.comment.set(newValue);
    this.inputChanged.emit(newValue);

    setTimeout(() => {
      inputEl.focus();
      const caret = start + emojiChar.length;
      inputEl.setSelectionRange(caret, caret);
    });
  }

  // --- Public Methods ---

  public clearComment(): void {
    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    this.comment.set('');
    this.inputChanged.emit('');

    if (this.isBrowser && this.commentInput?.nativeElement) {
      this.commentInput.nativeElement.value = '';
      this.commentInput.nativeElement.setSelectionRange(0, 0);
    }

    Logger.debug('[CommentBox] Comment cleared.');
  }

  public focusInput(): void {
    if (this.isBrowser && this.commentInput?.nativeElement) {

      this.commentInput.nativeElement.focus();
      this.isFocused.set(true);
    }
  }

  protected goToProfile(id: number): void {
    this._Router.navigate([TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE + '/' + TalbinahCommunityRoutesEnum.USER_COMMUNITY_PROFILE, id]);
    this.closed.emit();
  }
}
