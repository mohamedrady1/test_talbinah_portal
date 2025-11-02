// Model for instruction card data
export interface InstructionCard {
  readonly id: string;
  readonly titleKey: string;
  readonly subtitleKey: string;
}

// Model for start session payload
export interface StartSessionPayload {
  readonly text: string;
  readonly timestamp?: string;
}
