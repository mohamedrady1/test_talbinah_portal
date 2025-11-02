export interface InputSearchConfig {
  placeholder?: string;
  debounceMs?: number;
  persistKey?: string; // defaults to 'global-search-input'
  suggestions?: string[]; // local suggestions array
  formControl?: import('@angular/forms').FormControl<string>;
  autoFocus?: boolean;
  disabled?: boolean;

  keyboardNavigation?: boolean; // enable keyboard navigation: arrows, enter, esc
  remoteSuggestions?: boolean;  // enable remote API suggestion calls
  remoteSuggestionsApiUrl?: string; // API endpoint URL to fetch suggestions remotely
  emitWhenClick?: boolean;
}
