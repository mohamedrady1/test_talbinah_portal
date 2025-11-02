import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comming-soon',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './comming-soon.component.html',
  styleUrls: ['./comming-soon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommingSoonComponent {
  @Output() closed = new EventEmitter<void>();

  private readonly router = inject(Router)
  protected back(): void {

    // this.router.navigate([`/${MainPageRoutesEnum.MAINPAGE}`]);
    this.closed.emit();
  }
}
