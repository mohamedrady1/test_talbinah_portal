export interface SwipeConfig {
  readonly threshold: number;
  readonly velocity: number;
  readonly preventDefault: boolean;
  readonly allowVertical: boolean;
  readonly allowHorizontal: boolean;
  readonly maxAngleDeviation: number;
}

export interface TouchEventData {
  readonly startX: number;
  readonly startY: number;
  readonly currentX: number;
  readonly currentY: number;
  readonly deltaX: number;
  readonly deltaY: number;
  readonly velocity: number;
  readonly direction: SwipeDirection;
  readonly timestamp: number;
  readonly isActive: boolean;
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | 'none';

export interface SwipeEvent {
  readonly direction: SwipeDirection;
  readonly distance: number;
  readonly velocity: number;
  readonly duration: number;
  readonly element: HTMLElement;
}

export interface SwipeServiceConfig {
  readonly swipeConfig: SwipeConfig;
  readonly debounceTime: number;
  readonly enableKeyboardNavigation: boolean;
  readonly enableMouseDrag: boolean;
}

export interface SwipeState {
  readonly isActive: boolean;
  readonly currentIndex: number;
  readonly totalItems: number;
  readonly isAnimating: boolean;
  readonly touchData: TouchEventData | null;
}
