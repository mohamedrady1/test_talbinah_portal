import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Output, ViewChildren, WritableSignal, inject, signal, EventEmitter, QueryList, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-input.component.html',
  styleUrls: ['./code-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeInputComponent implements AfterViewInit, OnChanges {
  @ViewChildren('inputRefs') inputRefs!: QueryList<ElementRef<HTMLInputElement>>;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly isMobile = signal(false);

  @Input() inputsNumber: number = 4;
  readonly inputs: number[] = Array.from({ length: this.inputsNumber }, (_, i) => i);

  focusedIndex: WritableSignal<number> = signal(-1);

  @Input({ required: true }) clearInputs: boolean = false;
  @Input() typedInput: 'num' | 'char' | 'both' = 'num';

  @Output() codeChanged = new EventEmitter<string | null>();
  @Output() codeCompleted = new EventEmitter<string | null>();

  ngAfterViewInit(): void {
    this.detectMobile();
    this.focusFirstInput();
    this.setupInputAttributes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clearInputs']?.currentValue === true) {
      this.clearAllInputs();
    }
    if (changes['typedInput']) {
      this.setupInputAttributes();
    }
  }

  private detectMobile(): void {
    // SSR-safe mobile detection
    if (typeof window !== 'undefined') {
      this.isMobile.set(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
      this.cdr.markForCheck();
    }
  }

  private setupInputAttributes(): void {
    if (this.inputRefs) {
      this.inputRefs.forEach(input => {
        const el = input.nativeElement;
        if (this.typedInput === 'num' && this.isMobile()) {
          el.setAttribute('inputmode', 'numeric');
          el.setAttribute('pattern', '[0-9]*');
          el.type = 'tel'; // Better for numeric input on mobile
        } else {
          el.removeAttribute('inputmode');
          el.removeAttribute('pattern');
          el.type = 'text';
        }
      });
    }
  }

  private focusFirstInput(): void {
    setTimeout(() => {
      const first = this.inputRefs?.first?.nativeElement;
      if (first) {
        first.focus();
        this.focusedIndex.set(0);
        this.cdr.markForCheck();
      }
    });
  }

  private clearAllInputs(): void {
    this.inputRefs?.forEach(input => input.nativeElement.value = '');
    this.focusFirstInput();
    this.codeChanged.emit(null);
  }

  onCodeChanged(index: number, event: KeyboardEvent): void {
    const key = event.key;
    const inputs = this.inputRefs.toArray();
    const current = inputs[index]?.nativeElement;

    if (!current) return;

    if (key === 'Backspace' && current.value === '') {
      const previous = inputs[index - 1]?.nativeElement;
      if (previous) {
        previous.focus();
        this.focusedIndex.set(index - 1);
      }
    } else if (key.length === 1 && this.validateInput(key)) {
      current.value = key;
      this.codeChanged.emit(this.getConcatenatedValues());

      if (index < inputs.length - 1) {
        const next = inputs[index + 1]?.nativeElement;
        next?.focus();
        this.focusedIndex.set(index + 1);
      } else {
        this.onCodeCompleted();
        current.focus();
      }
    } else {
      event.preventDefault();
    }
  }

  private getConcatenatedValues(): string {
    return this.inputRefs.toArray().map(input => input.nativeElement.value).join('');
  }

  private validateInput(key: string): boolean {
    const patterns = {
      num: /^[0-9]$/, char: /^[a-zA-Z]$/, both: /^[0-9a-zA-Z]$/
    };
    return patterns[this.typedInput]?.test(key) ?? false;
  }

  private onCodeCompleted(): void {
    const isComplete = this.inputRefs.toArray().every(input => input.nativeElement.value !== '');
    if (isComplete) {
      const value = this.getConcatenatedValues();
      this.inputRefs.last.nativeElement.blur();
      this.codeCompleted.emit(value);
    }
  }
}
