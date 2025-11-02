export * from './urgent-appointment-floating-window';
export * from './book-urgent-appointment';
export * from './recall-new-appointement';
export * from './search-waiting-doctor';
export * from './patient-details-form';
export * from './order-summary';

// The following table summarizes the conditions and actions taken in the effect handling the response:

// | Condition                                             | Action                        |
// | ----------------------------------------------------- | ----------------------------- |
// | `response === null && remaining_time > 0`             | Start countdown               |
// | `response === null && remaining_time <= 0`            | Open recall modal             |
// | `response?.reservation === null && remaining_time > 0` | Start countdown               |
// | `response?.reservation?.id` exists                     | Navigate to page and stop all |
