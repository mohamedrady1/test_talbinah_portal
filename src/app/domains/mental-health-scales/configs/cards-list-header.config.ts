import { ICardHeaderConfig } from "../models"
import { SegmentOption } from '../../../shared/components/segment-control/segment-control.component';

export const MentalHealthSegmentOptions: SegmentOption[] = [
  { id: 'tests', title: 'assessments' },
  { id: 'measurements', title: 'mental_health_scale_depressive_disorder_scale' }
];

export const TestHeaderConfig: ICardHeaderConfig = {
    title: 'assessments',
    isButtonsVisible: false,
    isAllButtonVisible: true,
}
export const MoodHeaderConfig: ICardHeaderConfig = {
    title: 'mood2',
    isButtonsVisible: false,
    isAllButtonVisible: false,
}
export const DepressiveDisorderScaleHeaderConfig: ICardHeaderConfig = {
    title: 'mental_health_scale_depressive_disorder_scale',
    isButtonsVisible: false,
    isAllButtonVisible: true,
}
