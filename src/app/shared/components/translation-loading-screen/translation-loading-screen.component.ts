import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-translation-loading-screen',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './translation-loading-screen.component.html',
  styleUrls: ['./translation-loading-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TranslationLoadingScreenComponent {

}


