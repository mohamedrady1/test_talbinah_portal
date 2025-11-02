import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
  signal,
  HostListener,
  ElementRef,
  PLATFORM_ID
} from '@angular/core';
import { Subject, of, switchMap, debounceTime, takeUntil, catchError } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { InputSearchConfig } from '../../model';
import { UserContextService } from '../../../../../domains';
import { TranslationsFacade } from '../../../../../common/core/translations/services';

@Component({
  selector: 'app-global-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './global-search-input.component.html',
  styleUrls: ['./global-search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalSearchInputComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly input$ = new Subject<string>();
  private readonly http = inject(HttpClient);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly userContext = inject(UserContextService);
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  @Input() showLoadingIndicator = false;
  @Input() inputSearchConfig: InputSearchConfig = {};
  @Output() valueChanged = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();

  // Signals
  inputValue = signal('');
  filteredSuggestions = signal<string[]>([]);
  showSuggestions = signal(false);
  highlightedIndex = signal(-1);

  ngOnInit(): void {
    this.reset();
    this.setupValueChanges();

    // Reset search on login/logout
    this.userContext.recallUserDataViewed
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.clear());
  }

  private reset(): void {
    this.inputValue.set('');
    this.filteredSuggestions.set([]);
    this.showSuggestions.set(false);
    this.highlightedIndex.set(-1);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.config.persistKey);
    }

    this.config.formControl.reset('', { emitEvent: false });
  }

  private setupValueChanges(): void {
    this.config.formControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const val = (value ?? '') as string;
        this.inputValue.set(val);
        this.input$.next(val);
      });

    this.input$
      .pipe(
        debounceTime(this.config.debounceMs),
        switchMap(value => {
          if (isPlatformBrowser(this.platformId)) {
            if (value) {
              localStorage.setItem(this.config.persistKey, value);
            } else {
              localStorage.removeItem(this.config.persistKey);
            }
          }

          if (!this.config.emitWhenClick) {
            this.valueChanged.emit(value);
          }

          if (this.config.remoteSuggestions && this.config.remoteSuggestionsApiUrl) {
            return this.http
              .get<string[]>(this.config.remoteSuggestionsApiUrl, { params: { q: value } })
              .pipe(catchError(() => of([])));
          } else {
            const suggestions = this.config.suggestions as string[];
            const filtered = suggestions.filter(s =>
              s.toLowerCase().includes(value.toLowerCase())
            );
            return of(filtered);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(suggestions => {
        this.filteredSuggestions.set(suggestions);
        this.showSuggestions.set(suggestions.length > 0);
        this.highlightedIndex.set(-1);
      });
  }

  get config(): Required<InputSearchConfig> {
    return {
      placeholder: this.inputSearchConfig.placeholder || this.translate('search2'),
      debounceMs: this.inputSearchConfig.debounceMs ?? 300,
      persistKey: this.inputSearchConfig.persistKey || 'global-search-input',
      suggestions: this.inputSearchConfig.suggestions || [],
      formControl:
        (this.inputSearchConfig.formControl as FormControl<string>) ||
        new FormControl<string>(''),
      autoFocus: this.inputSearchConfig.autoFocus ?? false,
      disabled: this.inputSearchConfig.disabled ?? false,
      keyboardNavigation: this.inputSearchConfig.keyboardNavigation ?? false,
      remoteSuggestions: this.inputSearchConfig.remoteSuggestions ?? false,
      remoteSuggestionsApiUrl: this.inputSearchConfig.remoteSuggestionsApiUrl || '',
      emitWhenClick: this.inputSearchConfig.emitWhenClick ?? false
    };
  }

  protected onSearchClick(): void {
    if (this.config.emitWhenClick) {
      this.valueChanged.emit(this.inputValue());
      this.showSuggestions.set(false);
      this.highlightedIndex.set(-1);
    }
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.config.formControl.setValue(value);
    this.showSuggestions.set(true);
  }

  protected writeSuggestion(suggestion: string): void {
    this.config.formControl.setValue(suggestion);
    if (this.config.emitWhenClick) {
      this.valueChanged.emit(suggestion);
    }
    this.showSuggestions.set(false);
  }

  protected clear(): void {
    this.reset();
    this.cleared.emit();
  }

  @HostListener('keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.config.keyboardNavigation || !this.showSuggestions()) return;

    const suggestions = this.filteredSuggestions();
    let idx = this.highlightedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        idx = (idx + 1) % suggestions.length;
        this.highlightedIndex.set(idx);
        break;

      case 'ArrowUp':
        event.preventDefault();
        idx = (idx - 1 + suggestions.length) % suggestions.length;
        this.highlightedIndex.set(idx);
        break;

      case 'Enter':
        event.preventDefault();
        if (idx >= 0 && idx < suggestions.length) {
          this.writeSuggestion(suggestions[idx]);
        } else if (this.config.emitWhenClick) {
          this.valueChanged.emit(this.inputValue());
        }
        this.showSuggestions.set(false);
        this.highlightedIndex.set(-1);
        break;

      case 'Escape':
        event.preventDefault();
        this.showSuggestions.set(false);
        this.highlightedIndex.set(-1);
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.showSuggestions.set(false);
      this.highlightedIndex.set(-1);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
