import { ChangeDetectionStrategy, Component, EventEmitter, Output, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Logger } from '../../../../common';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-subscribe-successfully',
  standalone: true,
  imports: [TranslateModule, TranslateApiPipe],
  templateUrl: './subscribe-successfully.component.html',
  styleUrls: ['./subscribe-successfully.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscribeSuccessfullyComponent {
  @Output() confirm = new EventEmitter<void>();
  onConfirm() {
    this.confirm.emit();
  }
}
