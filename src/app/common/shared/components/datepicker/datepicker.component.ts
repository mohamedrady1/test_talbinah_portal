import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Renderer2,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
  OnDestroy
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

type Mode = 'inline' | 'dropdown';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerComponent implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private renderer = inject(Renderer2);
  private host = inject(ElementRef<HTMLElement>);

  /** Inputs */
  value = input<Date | null>(null);
  valueChange = output<Date | null>();
  minDate = input<Date | null>(null);
  disabledWeekDays = input<number[]>([]);
  disabled = input<boolean>(false);
  locale = input<string>('en');
  range = input<boolean>(false);
  mode = input<Mode>('inline');

  /** Internal State */
  isOpen = signal(false);
  viewYear = signal(new Date().getFullYear());
  viewMonth = signal(new Date().getMonth());
  position = signal<'above' | 'below'>('below');

  rangeStart = signal<Date | null>(null);
  rangeEnd = signal<Date | null>(null);
  hoverDate = signal<Date | null>(null);

  isMonthPicker = signal(false);
  isYearPicker = signal(false);

  focusedDate = signal<Date>(new Date());

  private removeClickListener?: () => void;

  weeks = computed(() => this.buildCalendar(this.viewYear(), this.viewMonth()));

  constructor() {
    // Sync calendar view with value
    effect(() => {
      const v = this.value();
      if (v) {
        this.viewYear.set(v.getFullYear());
        this.viewMonth.set(v.getMonth());
        this.focusedDate.set(v);
      }
    });
  }

  /** Dropdown toggle */
  toggleDropdown() {
    if (this.disabled()) return;
    this.isOpen.update(o => !o);

    if (this.isOpen()) {
      this.setPosition();
      this.bindOutsideClick();
    } else {
      this.unbindOutsideClick();
    }
  }

  /** Positioning logic (flip/fit) */
  private setPosition() {
    if (!isPlatformBrowser(this.platformId)) return;
    const rect = this.host.nativeElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    this.position.set(spaceBelow < 250 ? 'above' : 'below');
  }

  /** Outside click close */
  private bindOutsideClick() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.removeClickListener = this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.host.nativeElement.contains(event.target as Node)) {
        this.isOpen.set(false);
        this.unbindOutsideClick();
      }
    });
  }

  private unbindOutsideClick() {
    if (this.removeClickListener) {
      this.removeClickListener();
      this.removeClickListener = undefined;
    }
  }

  ngOnDestroy() {
    this.unbindOutsideClick();
  }

  /** Navigation */
  prevMonth() {
    let m = this.viewMonth();
    let y = this.viewYear();
    if (m === 0) { m = 11; y--; } else { m--; }
    this.viewMonth.set(m);
    this.viewYear.set(y);
  }
  nextMonth() {
    let m = this.viewMonth();
    let y = this.viewYear();
    if (m === 11) { m = 0; y++; } else { m++; }
    this.viewMonth.set(m);
    this.viewYear.set(y);
  }

  /** Select date */
  selectDate(day: Date) {
    if (this.isDisabledDate(day)) return;
    if (!this.range()) {
      this.valueChange.emit(day);
      this.isOpen.set(false);
      this.unbindOutsideClick();
    } else {
      if (!this.rangeStart()) {
        this.rangeStart.set(day);
      } else if (!this.rangeEnd()) {
        if (day < this.rangeStart()!) {
          this.rangeEnd.set(this.rangeStart());
          this.rangeStart.set(day);
        } else {
          this.rangeEnd.set(day);
        }
        this.valueChange.emit(day);
        this.isOpen.set(false);
        this.unbindOutsideClick();
      } else {
        this.rangeStart.set(day);
        this.rangeEnd.set(null);
      }
    }
  }

  /** State helpers */
  isSelected(day: Date): boolean {
    if (!this.range()) {
      const v = this.value();
      return !!v && this.sameDate(v, day);
    }
    const startSelected = this.rangeStart() && this.sameDate(this.rangeStart()!, day);
    const endSelected = this.rangeEnd() && this.sameDate(this.rangeEnd()!, day);
    return !!startSelected || !!endSelected;
  }

  isInRange(day: Date): boolean {
    if (!this.rangeStart() || !this.rangeEnd()) return false;
    return day >= this.onlyDateDate(this.rangeStart()!) &&
      day <= this.onlyDateDate(this.rangeEnd()!);
  }
  isToday(day: Date) {
    return this.sameDate(new Date(), day);
  }
  isDisabledDate(day: Date) {
    if (this.minDate() && this.onlyDate(day) < this.onlyDate(this.minDate()!)) return true;
    if (this.disabledWeekDays()?.includes(day.getDay())) return true;
    return false;
  }

  /** Month/year picker */
  openMonthPicker() { this.isMonthPicker.set(true); this.isYearPicker.set(false); }
  openYearPicker() { this.isYearPicker.set(true); this.isMonthPicker.set(false); }
  selectMonth(m: number) { this.viewMonth.set(m); this.isMonthPicker.set(false); }
  selectYear(y: number) { this.viewYear.set(y); this.isYearPicker.set(false); }

  monthLabel(y: number, m: number) {
    return new Date(y, m, 1).toLocaleString(this.locale(), { month: 'long', year: 'numeric' });
  }

  /** Calendar generation */
  private buildCalendar(year: number, month: number): Date[][] {
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const grid: Date[][] = [];
    let current = new Date(year, month, 1 - startDay);
    for (let w = 0; w < 6; w++) {
      const row: Date[] = [];
      for (let d = 0; d < 7; d++) {
        row.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      grid.push(row);
    }
    return grid;
  }

  /** Utility */
  private sameDate(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }
  private onlyDate(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }
  private onlyDateDate(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  /** Keyboard navigation */
  @HostListener('keydown', ['$event'])
  handleKey(e: KeyboardEvent) {
    if (!this.isOpen()) return;
    const fd = new Date(this.focusedDate());
    if (e.key === 'ArrowRight') { fd.setDate(fd.getDate() + 1); }
    if (e.key === 'ArrowLeft') { fd.setDate(fd.getDate() - 1); }
    if (e.key === 'ArrowUp') { fd.setDate(fd.getDate() - 7); }
    if (e.key === 'ArrowDown') { fd.setDate(fd.getDate() + 7); }
    if (e.key === 'Enter') { this.selectDate(fd); }
    if (e.key === 'Escape') { this.isOpen.set(false); this.unbindOutsideClick(); }
    this.focusedDate.set(fd);
    e.preventDefault();
  }
}
