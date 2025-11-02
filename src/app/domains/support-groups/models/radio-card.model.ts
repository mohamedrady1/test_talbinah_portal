export interface IRadioCardConfig {
  icon: string | null; // Make it nullable if the icon might be missing
  name: string;       // Assumed to always be present for radio button group
  title: string;      // Assumed to always be present as a display title
  value: string;      // This should always be present as the radio button's value
  // Add other properties that might exist on your config object, making them nullable if they can be:
  // description?: string | null;
  // someOtherProperty?: any;
}
