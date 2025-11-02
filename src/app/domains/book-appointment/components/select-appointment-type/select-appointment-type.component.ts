import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppointmentTypeSelectionsFacade } from '../../services';
import { BookAppointmentRoutesEnum } from '../../constants';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { IAppointmentTypeSelectionItem } from '../../dtos';
import { AppointmentsRoutesEnum } from '../../../appointments';

@Component({
  selector: 'app-select-appointment-type',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './select-appointment-type.component.html',
  styleUrls: ['./select-appointment-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectAppointmentTypeComponent {
  @Output() protected closed = new EventEmitter<void>();
  @Input() type: string = 'BookAppointment';

  private readonly _facade = inject(AppointmentTypeSelectionsFacade);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  protected isLoading = this._facade.isLoading;
  protected error = this._facade.error;

  // Combine API data with config styles
  protected selections = () => {
    const data = this._facade.selections() || [];

    return data.map((item) => {
      return {
        ...item,
        titleColor: item.color || '#0E39B6', // Fallback primary
        bgColor: (item.first_color && item.second_color)
          ? `linear-gradient(180deg, ${item.first_color} 0%, ${item.second_color} 100%), #FFF`
          : 'linear-gradient(180deg, #B8EFE9 0%, #AECEE7 100%), #FFF', // Fallback
        borderColor: item.color || '#E7EBF8'
      };
    });
  };


  ngOnInit(): void {
    this._facade.load();
  }

  protected onSelect(selection: IAppointmentTypeSelectionItem): void {
    console.log('SelectAppointmentTypeComponent | Selected Type: ', selection.id, '-', selection.name);
    console.log('SelectAppointmentTypeComponent | Page Type:', this.type);
    let targetPage: string = this.type == 'Appointments' ? AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE : BookAppointmentRoutesEnum.BOOK_APPOINTMENT_MAIN_PAGE;
    this.router.navigate(
      [targetPage],
      { queryParams: { typeId: selection.id } }
    );
    this.closed.emit();
  }

  protected onImageError(event: Event): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'images/auth/icons/talbinah.png';
  }

  protected retry(): void {
    this._facade.load();
  }
}
