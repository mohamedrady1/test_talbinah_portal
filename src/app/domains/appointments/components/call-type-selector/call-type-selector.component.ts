import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallType, ICallTypeSelectedEvent } from '../../../../shared';
import { Logger } from '../../../../common';

@Component({
  selector: 'app-call-type-selector',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './call-type-selector.component.html',
  styleUrls: ['./call-type-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallTypeSelectorComponent {
  @Output() public selectedType: EventEmitter<ICallTypeSelectedEvent> = new EventEmitter<ICallTypeSelectedEvent>();

  public onSelectCallType(type: CallType): void {
    Logger.debug(`CallTypeSelectorComponent: Selected call type: ${type}`);
    this.selectedType.emit({ type });
  }
}
