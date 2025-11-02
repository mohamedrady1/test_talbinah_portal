import { CommonModule } from '@angular/common';
import { Component, Input, signal, Signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-program-progress',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './program-progress.component.html',
  styleUrls: ['./program-progress.component.scss']
})
export class ProgramProgressComponent {
  private _rate = signal(0);
  rate: Signal<number> = this._rate;

  @Input() set value(val: number) {
    this._rate.set(Math.max(0, Math.min(val, 100)));
  }
}
