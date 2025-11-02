import { ChangeDetectionStrategy, Component, Input, OnInit, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

// Import necessary components and facades
import { ErrorStateComponent, EmptyStateComponent, ModalService } from '../../../../shared';
import { MentalHealthScaleTestShimmerComponent } from '../mental-health-scale-test-shimmer';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { CardComponent } from '../card';
import { MentalHealthScalesFacade, MyMeasurementsFacade } from '../../services';
import { getMeasurementsError, getmyMeasurementsError, MeasurementsEmptyState } from '../../configs';

@Component({
  selector: 'app-all-mental-health',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    MentalHealthScaleTestShimmerComponent,
    AutoExactHeightDirective
  ],
  templateUrl: './all-mental-health.component.html',
  styleUrls: ['./all-mental-health.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllMentalHealthComponent implements OnInit {
  @Input() type!: string;
  @Input() image!: string; // Not strictly used in the logic, but passed in for consistency
  @Input() title!: string; // Used for the modal header, likely in the parent's template

  private readonly _mentalHealthScalesFacade = inject(MentalHealthScalesFacade);
  private readonly _MyMeasurementsFacade = inject(MyMeasurementsFacade);
  private readonly modalService = inject(ModalService);

  readonly scales = this._mentalHealthScalesFacade.scales;
  readonly isLoadingScales = this._mentalHealthScalesFacade.isLoading;
  readonly scalesErrorMessage = this._mentalHealthScalesFacade.errorMessage;

  readonly myMeasurementsList = this._MyMeasurementsFacade.myMeasurements;
  readonly isLoadingMyMeasurementsList = this._MyMeasurementsFacade.isLoading;
  readonly myMeasurementsListErrorMessage = this._MyMeasurementsFacade.errorMessage;

  protected readonly measurementsEmptyState = MeasurementsEmptyState; // Re-use from parent
  protected readonly measurementsErrorState = getMeasurementsError(() => this._mentalHealthScalesFacade.fetchAll());
  protected readonly myMeasurementsErrorState = getmyMeasurementsError(() => this._MyMeasurementsFacade.fetchMyMeasurements());

  // `isFinished` signal might be needed if you want to update the parent component
  // or handle the quiz completion state within the modal itself.
  isFinished = signal<boolean>(false);


  ngOnInit(): void {
    // Fetch all data regardless of type, or implement conditional fetching if preferred
    // For simplicity, we'll fetch both, and let the template render conditionally.
    // If you have a very large number of scales/measurements, you might want to
    // optimize this to only fetch what's needed for the current 'type'.
    this._mentalHealthScalesFacade.fetchAll();
    this._MyMeasurementsFacade.fetchMyMeasurements();
  }

  protected onWatchDetails(item: any): void {
    // Implement logic to show details of a depressive disorder scale item
    console.log('Watch details for:', item);
    // You might open another modal or navigate to a details page
  }

}
