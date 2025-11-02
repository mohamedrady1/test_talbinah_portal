import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SvgIconComponent } from '../../../../shared';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [
    CommonModule,

    SvgIconComponent
  ],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent {
  protected readonly _ThemeService = inject(ThemeService);
}
