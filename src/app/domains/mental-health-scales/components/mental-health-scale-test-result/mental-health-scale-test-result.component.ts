import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SpecialistCardComponent } from '../specialist-card';
import { PercentageKnobComponent } from '../percentage-knob';
import { Logger } from '../../../../common';
import { EmptyStateCardComponent } from '../../../../shared';
import { MentalHealthResultEmptyState } from '../../configs';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-mental-health-scale-test-result',
  standalone: true,
  imports: [SpecialistCardComponent, PercentageKnobComponent, EmptyStateCardComponent, TranslateApiPipe],
  templateUrl: './mental-health-scale-test-result.component.html',
  styleUrls: ['./mental-health-scale-test-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentalHealthScaleTestResultComponent {
  @Input() result!: any;
  @Input() resultScore!: number | null;
  emptyStateConfig = MentalHealthResultEmptyState;
  ngOnInit(): void {
    console.log('MentalHealthScaleTestResultComponent => Input Result: ', this.result);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (!this.result.percentage) {
      this.result.percentage = (this.resultScore ?? 0 / this.result?.total_grade) * 100;
      console.log('MentalHealthScaleTestResultComponent => Calculated Percentage: ', this.result.percentage);
    }
    Logger.debug('MentalHealthScaleTestResultComponent => Result: ', this.result);
  }
}
