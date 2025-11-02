import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-security-option-card',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './security-option-card.component.html',
  styleUrls: ['./security-option-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityOptionCardComponent {
  @Input() config: any;
  @Output() optionClick = new EventEmitter<void>();

  onOptionClick() {
    this.optionClick.emit();
  }
}
