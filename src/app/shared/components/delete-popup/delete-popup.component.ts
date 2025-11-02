import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationsFacade } from '../../../common/core/translations';

@Component({
  selector: 'app-delete-popup',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeletePopupComponent {
  private readonly translationsFacade = inject(TranslationsFacade);

  @Output() closed = new EventEmitter<{ status: boolean }>();

  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }

  protected confirmDelete(): void {
    this.closed.emit({ status: true });
  }

  protected closeModal(): void {
    this.closed.emit({ status: false });
  }
}
