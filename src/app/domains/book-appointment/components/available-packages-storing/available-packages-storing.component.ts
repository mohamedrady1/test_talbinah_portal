import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { IGlobalDoctorContactInfoModel, Logger } from '../../../../common';
import { IReservationPackageModel } from '../../../appointments';
import { PatientDetailsFormComponent } from '../../../urgent-appointment';
import { ModalService } from '../../../../shared';

import { ReservationPackageItemFormComponent, IReservationStepData } from '../reservation-package-item-form';
import { TranslateApiPipe } from '../../../../common/core/translations';
export interface IDisabledMap {
  /** ISO date -> Set of "HH:mm-HH:mm" that are taken */
  timesByDate: Record<string, Set<string>>;
}

@Component({
  selector: 'app-available-packages-storing',
  standalone: true,
  imports: [ReservationPackageItemFormComponent, TranslateModule, TranslateApiPipe],
  templateUrl: './available-packages-storing.component.html',
  styleUrls: ['./available-packages-storing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailablePackagesStoringComponent {
  @Input({ required: true }) data!: IReservationPackageModel | null;
  @Input({ required: true }) public doctor!: IGlobalDoctorContactInfoModel;
  @Input({ required: true }) public reservationFormData!: {
    date: string;           // "yyyy-MM-dd"
    start_time: string;     // "HH:mm"
    end_time: string;       // "HH:mm"
    doctor_id: number;
    day_id: number;
    communication_id: number;
    duration_id: number;
  };

  @Output() closed = new EventEmitter<IReservationStepData[] | null>();

  @ViewChild(ReservationPackageItemFormComponent)
  private reservationPackageItemForm!: ReservationPackageItemFormComponent;

  /** steps signals */
  protected currentStep = signal<number>(1);
  protected totalSteps = computed(() => this.data?.number_of_reservations ?? 1);
  protected isFirstStep = computed(() => this.currentStep() === 1);
  protected isFinalStep = computed(() => this.currentStep() === this.totalSteps());

  /** Holds per-step selections (or null when not filled yet) */
  protected selectedReservationsData = signal<(IReservationStepData | null)[]>([]);

  /** Re-render child on step move to force UI refresh where needed */
  protected formInstanceKey = signal<number>(Date.now());

  /** Disable map built from previous steps (times that cannot be reused) */
  protected disabledMap = computed<IDisabledMap>(() => {
    const map: IDisabledMap = { timesByDate: {} };
    const list = this.selectedReservationsData();

    list.forEach((step, idx) => {
      if (!step) return;
      const dateISO = this.ensureISO(step.date);
      const key = `${step.time_id.start_time}-${step.time_id.end_time}`;
      if (!map.timesByDate[dateISO]) map.timesByDate[dateISO] = new Set<string>();
      map.timesByDate[dateISO].add(key);
    });

    return map;
  });

  private readonly _ModalService = inject(ModalService);

  constructor() {
    effect(() => {
      // initialize when package changes
      const total = this.totalSteps();
      if (total > 0) {
        this.currentStep.set(1);
        this.selectedReservationsData.set(Array(total).fill(null));
        this.formInstanceKey.set(Date.now());
      }
    });

    effect(() => {
      Logger.debug('AvailablePackagesStoringComponent : ', {
        packageData: this.data,
        doctor: this.doctor,
        reservationFormData: this.reservationFormData
      });
    });
  }

  /** parent provides the step’s initial data (readonly for step 1) */
  protected getReservationFormDataForCurrentStep(): IReservationStepData | null {
    const stepIndex = this.currentStep() - 1;

    // If already filled, return the stored data (so user sees their choices when going back)
    const existing = this.selectedReservationsData()[stepIndex];
    if (existing) return existing;

    // Step 1 should be prefilled & locked with reservationFormData
    if (this.isFirstStep()) {
      return {
        date: this.reservationFormData.date,
        time_id: {
          start_time: this.reservationFormData.start_time,
          end_time: this.reservationFormData.end_time
        }
      };
    }

    return null;
  }

  /** A readonly flag to lock date/time in step 1 */
  protected lockInitialSelectionForCurrentStep(): boolean {
    return this.isFirstStep();
  }

  /** A flattened array of ALL used (date, time) pairs in earlier steps to block reuse */
  protected getAllPreviouslyUsedTimes(): Array<{ date: string; start_time: string; end_time: string }> {
    const used: Array<{ date: string; start_time: string; end_time: string }> = [];
    const idx = this.currentStep() - 1;
    this.selectedReservationsData()
      .slice(0, idx) // earlier steps only
      .forEach(step => {
        if (!step) return;
        used.push({
          date: this.ensureISO(step.date),
          start_time: step.time_id.start_time,
          end_time: step.time_id.end_time
        });
      });

    // Also include step 1 initial (reservationFormData) if we’re beyond step 1 and user didn’t alter it
    if (idx > 0 && this.selectedReservationsData()[0] === null && this.reservationFormData) {
      used.push({
        date: this.reservationFormData.date,
        start_time: this.reservationFormData.start_time,
        end_time: this.reservationFormData.end_time
      });
    }

    return used;
  }

  /** navigation */
  protected async continue(): Promise<void> {
    if (!this.reservationPackageItemForm) {
      Logger.error('AvailablePackagesStoringComponent: ReservationPackageItemFormComponent not found.');
      return;
    }

    const validationResult = await this.reservationPackageItemForm.validateAndGetFormData();

    if (validationResult.isValid && validationResult.data) {
      this.selectedReservationsData.update(arr => {
        const copy = [...arr];
        copy[this.currentStep() - 1] = validationResult.data!;
        return copy;
      });

      if (!this.isFinalStep()) {
        this.currentStep.update(v => v + 1);
        this.formInstanceKey.set(Date.now());
        Logger.debug('Moving to next step. Accumulated data:', this.selectedReservationsData());
      } else {
        Logger.debug('Final data:', this.selectedReservationsData());
        this.openPatientDetails(this.selectedReservationsData());
      }
    } else {
      Logger.warn('Current step invalid.');
    }
  }

  protected back(): void {
    const cur = this.currentStep();
    if (cur > 1) {
      this.currentStep.set(cur - 1);
      this.formInstanceKey.set(Date.now());
      Logger.debug('Moved back to step', this.currentStep());
    }
  }

  private openPatientDetails(packagesReservationsList: (IReservationStepData | null)[]): void {
    this._ModalService.open(PatientDetailsFormComponent, {
      inputs: {
        image: 'images/urgent-appointment/calender-2.png',
        title: 'patient_details_modal_title',
        subtitle: 'patient_details_modal_subtitle',
        type: 'normal',
        data: {
          appointmentForm: this.reservationFormData,
          packagesReservationsList,
          doctor_id: this.doctor?.id,
          package_id: this.data?.id,
          type: ''
        }
      },
      outputs: {
        closed: () => Logger.debug('The modal is closed')
      },
      width: '50%',
    });
  }

  protected onCloseClick(): void {
    this.closed.emit(null);
  }

  private ensureISO(d: string | Date): string {
    if (typeof d === 'string') return d;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
