import { TouchEventData, SwipeEvent, SwipeDirection, SwipeState, SwipeServiceConfig } from '../interfaces/swipe.interfaces';
import { Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Logger } from '../../../common';

@Injectable({
  providedIn: 'root'
})
export class SwipeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Default configuration
  private readonly defaultConfig: SwipeServiceConfig = {
    swipeConfig: {
      threshold: 50,
      velocity: 0.3,
      preventDefault: true,
      allowVertical: false,
      allowHorizontal: true,
      maxAngleDeviation: 30
    },
    debounceTime: 100,
    enableKeyboardNavigation: true,
    enableMouseDrag: true
  };

  // Internal state
  private readonly _state = signal<SwipeState>({
    isActive: false,
    currentIndex: 0,
    totalItems: 0,
    isAnimating: false,
    touchData: null
  });

  // Public readonly state
  readonly state = this._state.asReadonly();
  readonly isActive = computed(() => this._state().isActive);
  readonly currentIndex = computed(() => this._state().currentIndex);
  readonly isAnimating = computed(() => this._state().isAnimating);

  // Event emitters
  private readonly _swipeEventSubject = new EventTarget();
  private readonly _stateChangeSubject = new EventTarget();

  // Private properties
  private _config: SwipeServiceConfig = this.defaultConfig;
  private _container: HTMLElement | null = null;
  private _items: HTMLElement[] = [];
  private _touchStartData: TouchEventData | null = null;
  private _animationFrameId: number | null = null;
  private _debounceTimeout: number | null = null;

  // Bound event handlers for proper cleanup
  private _boundTouchStart?: (event: TouchEvent) => void;
  private _boundTouchMove?: (event: TouchEvent) => void;
  private _boundTouchEnd?: (event: TouchEvent) => void;
  private _boundMouseDown?: (event: MouseEvent) => void;
  private _boundMouseMove?: (event: MouseEvent) => void;
  private _boundMouseUp?: (event: MouseEvent) => void;
  private _boundKeyDown?: (event: KeyboardEvent) => void;
  private _boundContextMenu?: (event: Event) => void;

  // Initialize swipe functionality for a container
  public initialize(
    container: HTMLElement,
    items: HTMLElement[],
    config?: Partial<SwipeServiceConfig>
  ): void {
    if (!this.isBrowser) return;

    this._config = { ...this.defaultConfig, ...config };
    this._container = container;
    this._items = items;

    this._updateState({
      totalItems: items.length,
      currentIndex: 0,
      isActive: true
    });

    this._attachEventListeners();
  }

  //  Clean up event listeners and reset state
  public destroy(): void {
    if (!this.isBrowser) return;

    this._detachEventListeners();
    this._container = null;
    this._items = [];
    this._touchStartData = null;

    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }

    if (this._debounceTimeout) {
      clearTimeout(this._debounceTimeout);
      this._debounceTimeout = null;
    }

    this._updateState({
      isActive: false,
      currentIndex: 0,
      totalItems: 0,
      isAnimating: false,
      touchData: null
    });
  }

  // Navigate to specific index
  public navigateTo(index: number, animated: boolean = true): void {
    if (!this.isActive() || index < 0 || index >= this._items.length) return;

    this._updateState({ currentIndex: index, isAnimating: animated });
    this._scrollToItem(index, animated);
  }

  // Navigate to next item
  public next(animated: boolean = true): void {
    const nextIndex = (this.currentIndex() + 1) % this._items.length;
    this.navigateTo(nextIndex, animated);
  }

  //  Navigate to previous item
  public previous(animated: boolean = true): void {
    const prevIndex = this.currentIndex() === 0
      ? this._items.length - 1
      : this.currentIndex() - 1;
    this.navigateTo(prevIndex, animated);
  }

  // Add event listener for swipe events
  public addEventListener(
    event: 'swipe' | 'stateChange',
    listener: EventListener
  ): void {
    const subject = event === 'swipe' ? this._swipeEventSubject : this._stateChangeSubject;
    subject.addEventListener(event, listener);
  }

  //  Remove event listener
  public removeEventListener(
    event: 'swipe' | 'stateChange',
    listener: EventListener
  ): void {
    const subject = event === 'swipe' ? this._swipeEventSubject : this._stateChangeSubject;
    subject.removeEventListener(event, listener);
  }

  //  Get current configuration
  public getConfig(): SwipeServiceConfig {
    return { ...this._config };
  }

  //  Update configuration
  public updateConfig(config: Partial<SwipeServiceConfig>): void {
    this._config = { ...this._config, ...config };
  }

  // Private methods
  private _attachEventListeners(): void {
    if (!this._container) return;

    // Store bound methods for proper cleanup
    this._boundTouchStart = this._handleTouchStart.bind(this);
    this._boundTouchMove = this._handleTouchMove.bind(this);
    this._boundTouchEnd = this._handleTouchEnd.bind(this);
    this._boundMouseDown = this._handleMouseDown.bind(this);
    this._boundMouseMove = this._handleMouseMove.bind(this);
    this._boundMouseUp = this._handleMouseUp.bind(this);
    this._boundKeyDown = this._handleKeyDown.bind(this);
    this._boundContextMenu = (e: Event) => e.preventDefault();

    // Touch events
    if (this._boundTouchStart) {
      this._container.addEventListener('touchstart', this._boundTouchStart, { passive: false });
    }
    if (this._boundTouchMove) {
      this._container.addEventListener('touchmove', this._boundTouchMove, { passive: false });
    }
    if (this._boundTouchEnd) {
      this._container.addEventListener('touchend', this._boundTouchEnd, { passive: false });
    }

    // Mouse events (for desktop drag)
    if (this._config.enableMouseDrag) {
      if (this._boundMouseDown) {
        this._container.addEventListener('mousedown', this._boundMouseDown);
      }
      if (this._boundMouseMove) {
        this._container.addEventListener('mousemove', this._boundMouseMove);
      }
      if (this._boundMouseUp) {
        this._container.addEventListener('mouseup', this._boundMouseUp);
        this._container.addEventListener('mouseleave', this._boundMouseUp);
      }
    }

    // Keyboard events
    if (this._config.enableKeyboardNavigation && this._boundKeyDown) {
      this._container.addEventListener('keydown', this._boundKeyDown);
    }

    // Prevent context menu on long press
    if (this._boundContextMenu) {
      this._container.addEventListener('contextmenu', this._boundContextMenu);
    }
  }

  private _detachEventListeners(): void {
    if (!this._container) return;

    // Remove touch events
    if (this._boundTouchStart) {
      this._container.removeEventListener('touchstart', this._boundTouchStart);
    }
    if (this._boundTouchMove) {
      this._container.removeEventListener('touchmove', this._boundTouchMove);
    }
    if (this._boundTouchEnd) {
      this._container.removeEventListener('touchend', this._boundTouchEnd);
    }

    // Remove mouse events
    if (this._boundMouseDown) {
      this._container.removeEventListener('mousedown', this._boundMouseDown);
    }
    if (this._boundMouseMove) {
      this._container.removeEventListener('mousemove', this._boundMouseMove);
    }
    if (this._boundMouseUp) {
      this._container.removeEventListener('mouseup', this._boundMouseUp);
      this._container.removeEventListener('mouseleave', this._boundMouseUp);
    }

    // Remove keyboard events
    if (this._boundKeyDown) {
      this._container.removeEventListener('keydown', this._boundKeyDown);
    }

    // Remove context menu prevention
    if (this._boundContextMenu) {
      this._container.removeEventListener('contextmenu', this._boundContextMenu);
    }

    // Clear bound handlers
    this._boundTouchStart = undefined;
    this._boundTouchMove = undefined;
    this._boundTouchEnd = undefined;
    this._boundMouseDown = undefined;
    this._boundMouseMove = undefined;
    this._boundMouseUp = undefined;
    this._boundKeyDown = undefined;
    this._boundContextMenu = undefined;
  }

  private _handleTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    this._touchStartData = this._createTouchData(touch.clientX, touch.clientY, true);

    Logger.debug('SwipeService | Touch start:', {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: this._touchStartData.timestamp
    });

    this._updateState({
      touchData: this._touchStartData,
      isAnimating: false
    });
  }

  private _handleTouchMove(event: TouchEvent): void {
    if (!this._touchStartData || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const currentTouchData = this._createTouchData(
      this._touchStartData.startX,
      this._touchStartData.startY,
      false,
      touch
    );

    this._updateState({ touchData: currentTouchData });

    if (this._shouldPreventDefault(currentTouchData)) {
      event.preventDefault();
    }
  }

  private _handleTouchEnd(event: TouchEvent): void {
    if (!this._touchStartData) return;

    const touchData = this._state().touchData;

    Logger.debug('SwipeService | Touch end:', {
      deltaX: touchData?.deltaX,
      deltaY: touchData?.deltaY,
      direction: touchData?.direction,
      velocity: touchData?.velocity,
      isValid: touchData ? this._isValidSwipe(touchData) : false
    });

    if (touchData && this._isValidSwipe(touchData)) {
      Logger.debug('SwipeService | Valid swipe detected!');
      this._handleSwipe(touchData);
    }

    this._updateState({
      touchData: null,
      isAnimating: false
    });
    this._touchStartData = null;
  }

  private _handleMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return; // Only left mouse button

    const touchData = this._createTouchData(event.clientX, event.clientY, true);
    this._touchStartData = touchData;

    this._updateState({
      touchData,
      isAnimating: false
    });
  }

  private _handleMouseMove(event: MouseEvent): void {
    if (!this._touchStartData) return;

    const currentTouchData = this._createTouchData(
      this._touchStartData.startX,
      this._touchStartData.startY,
      false,
      event
    );

    this._updateState({ touchData: currentTouchData });
  }

  private _handleMouseUp(event: MouseEvent): void {
    if (!this._touchStartData) return;

    const touchData = this._state().touchData;
    if (touchData && this._isValidSwipe(touchData)) {
      this._handleSwipe(touchData);
    }

    this._updateState({
      touchData: null,
      isAnimating: false
    });
    this._touchStartData = null;
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previous();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
      case 'Home':
        event.preventDefault();
        this.navigateTo(0);
        break;
      case 'End':
        event.preventDefault();
        this.navigateTo(this._items.length - 1);
        break;
    }
  }

  private _createTouchData(
    startX: number,
    startY: number,
    isActive: boolean,
    currentTouch?: Touch | MouseEvent
  ): TouchEventData {
    const currentX = currentTouch ? currentTouch.clientX : startX;
    const currentY = currentTouch ? currentTouch.clientY : startY;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Calculate velocity based on time difference
    const now = Date.now();
    const timeDiff = this._touchStartData ? now - this._touchStartData.timestamp : 0;
    const velocity = timeDiff > 0 ? distance / timeDiff : 0;
    const direction = this._calculateDirection(deltaX, deltaY);

    return {
      startX,
      startY,
      currentX,
      currentY,
      deltaX,
      deltaY,
      velocity,
      direction,
      timestamp: now,
      isActive
    };
  }

  private _calculateDirection(deltaX: number, deltaY: number): SwipeDirection {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < 10 && absY < 10) return 'none';

    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    const absAngle = Math.abs(angle);

    if (absAngle <= this._config.swipeConfig.maxAngleDeviation ||
      absAngle >= 180 - this._config.swipeConfig.maxAngleDeviation) {
      return deltaX > 0 ? 'right' : 'left';
    }

    if (absAngle >= 90 - this._config.swipeConfig.maxAngleDeviation &&
      absAngle <= 90 + this._config.swipeConfig.maxAngleDeviation) {
      return deltaY > 0 ? 'down' : 'up';
    }

    return 'none';
  }

  private _isValidSwipe(touchData: TouchEventData): boolean {
    const { direction, deltaX, deltaY, velocity } = touchData;
    const { threshold, velocity: minVelocity, allowHorizontal, allowVertical } = this._config.swipeConfig;

    Logger.debug('SwipeService | Validating swipe:', {
      direction,
      deltaX,
      deltaY,
      velocity,
      threshold,
      minVelocity,
      allowHorizontal,
      allowVertical
    });

    if (direction === 'none') {
      Logger.debug('SwipeService | Invalid: direction is none');
      return false;
    }

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    Logger.debug('SwipeService | Distance:', distance, 'Threshold:', threshold);

    if (distance < threshold) {
      Logger.debug('SwipeService | Invalid: distance too small');
      return false;
    }

    if (velocity < minVelocity) {
      Logger.debug('SwipeService | Invalid: velocity too low');
      return false;
    }

    if (direction === 'left' || direction === 'right') {
      const isValid = allowHorizontal;
      Logger.debug('SwipeService | Horizontal swipe valid:', isValid);
      return isValid;
    }

    if (direction === 'up' || direction === 'down') {
      const isValid = allowVertical;
      Logger.debug('SwipeService | Vertical swipe valid:', isValid);
      return isValid;
    }

    Logger.debug('SwipeService | Invalid: unknown direction');
    return false;
  }

  private _shouldPreventDefault(touchData: TouchEventData): boolean {
    if (!this._config.swipeConfig.preventDefault) return false;

    const { direction, deltaX, deltaY } = touchData;
    const { allowHorizontal, allowVertical } = this._config.swipeConfig;

    if (direction === 'left' || direction === 'right') {
      return allowHorizontal && Math.abs(deltaX) > Math.abs(deltaY);
    }

    if (direction === 'up' || direction === 'down') {
      return allowVertical && Math.abs(deltaY) > Math.abs(deltaX);
    }

    return false;
  }

  private _handleSwipe(touchData: TouchEventData): void {
    const { direction } = touchData;

    if (direction === 'left') {
      this.next();
    } else if (direction === 'right') {
      this.previous();
    }

    this._emitSwipeEvent(touchData);
  }

  private _scrollToItem(index: number, animated: boolean): void {
    if (!this._container || !this._items[index]) return;

    const item = this._items[index];
    const containerRect = this._container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const scrollLeft = this._container.scrollLeft +
      (itemRect.left - containerRect.left) -
      containerRect.width / 2 +
      itemRect.width / 2;

    if (animated) {
      this._container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    } else {
      this._container.scrollLeft = scrollLeft;
    }
  }

  private _emitSwipeEvent(touchData: TouchEventData): void {
    const swipeEvent: SwipeEvent = {
      direction: touchData.direction,
      distance: Math.sqrt(touchData.deltaX * touchData.deltaX + touchData.deltaY * touchData.deltaY),
      velocity: touchData.velocity,
      duration: Date.now() - touchData.timestamp,
      element: this._container!
    };

    const event = new CustomEvent('swipe', { detail: swipeEvent });
    this._swipeEventSubject.dispatchEvent(event);
  }

  private _updateState(updates: Partial<SwipeState>): void {
    this._state.update(current => ({ ...current, ...updates }));

    const event = new CustomEvent('stateChange', { detail: this._state() });
    this._stateChangeSubject.dispatchEvent(event);
  }
}
