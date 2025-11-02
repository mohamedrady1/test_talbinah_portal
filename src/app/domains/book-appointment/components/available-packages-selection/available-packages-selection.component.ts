import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ICheckPackagesReservationData, IReservationPackageModel } from '../../../appointments';
import { TranslateModule } from '@ngx-translate/core';
import { Logger } from '../../../../common';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-available-packages-selection',
  standalone: true,
  imports: [
    TranslateModule,

  ],
  templateUrl: './available-packages-selection.component.html',
  styleUrls: ['./available-packages-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailablePackagesSelectionComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }

  @Input({ required: true }) data!: ICheckPackagesReservationData | null;

  @Output() closed = new EventEmitter<IReservationPackageModel | null>();
  protected selectedItem = signal<IReservationPackageModel | null>(null);

  ngOnInit(): void {
    // if (this.data?.packages[0]) {
    //   this.selectedItem.set(this.data?.packages[2]);
    //   this.continue();
    // }
    Logger.debug('AvailablePackagesSelectionComponent | data: ', this.data);
  }
  protected continue(): void {
    this.closed.emit(this.selectedItem());
  }

  protected onCloseClick(): void {
    this.closed.emit(null);
  }

  protected onSelect(item: IReservationPackageModel): void {
    this.selectedItem.set(item);
  }
  protected isSelected(item: IReservationPackageModel): boolean {
    return this.selectedItem()?.id === item.id;
  }
}

