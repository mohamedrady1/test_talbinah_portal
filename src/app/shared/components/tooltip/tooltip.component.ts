import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TriggerTypes } from '../../../common/core/data-access/pagination/enums/trigger-types.enum';
import { Position } from '../../../common/core/data-access/pagination/enums/positions.enum';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  templateUrl: './tooltip.component.html',
  imports: [CommonModule, TranslateModule],
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent {
  @Input({ required: true }) text!: string;
  @Input() position: Position = Position.TOP;
  @Input() trigger: TriggerTypes = TriggerTypes.HOVER;
  @Input() autoHideDuration = 1500; // for click trigger

  private visibleSignal = signal(false);
  readonly visible = this.visibleSignal.asReadonly();

  show = () => {
    this.visibleSignal.set(true);

    if (this.trigger === 'click') {
      setTimeout(() => this.hide(), this.autoHideDuration);
    }
  };

  hide = () => this.visibleSignal.set(false);

  toggle = () => {
    this.visibleSignal.update(v => !v);
    if (this.visible()) {
      setTimeout(() => this.hide(), this.autoHideDuration);
    }
  };
}
