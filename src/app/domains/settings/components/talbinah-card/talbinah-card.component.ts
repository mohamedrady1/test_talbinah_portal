import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon.component';

@Component({
  selector: 'app-talbinah-card',
  standalone: true,
  imports: [TranslateModule, SvgIconComponent],
  templateUrl: './talbinah-card.component.html',
  styleUrls: ['./talbinah-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TalbinahCardComponent {

}
