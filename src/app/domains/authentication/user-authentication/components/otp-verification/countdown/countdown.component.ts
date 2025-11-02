import { Component, Input, Output, EventEmitter, signal, computed, inject, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-countdown',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownComponent implements OnInit, OnDestroy {
  // Input countdown end time in milliseconds or string parsable by Date
  @Input({ required: true }) customTime!: number | string;
  @Output() emitTimeEnd = new EventEmitter<{ end: boolean }>();

  private readonly router = inject(Router);

  private readonly now = signal(Date.now());
  private readonly endTime = signal<number>(0);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly timeLeft = computed(() => {
    const distance = this.endTime() - this.now();
    if (distance <= 0) return 0;
    return distance;
  });

  readonly formattedTime = computed((): string => {
    const distance = this.timeLeft();

    if (distance <= 0) return 'Expired';

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (days > 0) return `${days}:${hours.toString().padStart(2, '0')}`;
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}`;
    if (minutes > 0) return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    return `00:${seconds.toString().padStart(2, '0')}`;
  });

  ngOnInit(): void {
    const target = typeof this.customTime === 'string'
      ? new Date(this.customTime).getTime()
      : this.customTime;

    if (!target || isNaN(target)) {
      console.warn('[CountdownComponent] Invalid or missing customTime:', this.customTime);
      return;
    }

    this.endTime.set(target);
    this.emitTimeEnd.emit({ end: false });

    this.intervalId = setInterval(() => {
      this.now.set(Date.now());

      if (this.timeLeft() <= 0) {
        this.emitTimeEnd.emit({ end: true });
        this.clearTimer();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
