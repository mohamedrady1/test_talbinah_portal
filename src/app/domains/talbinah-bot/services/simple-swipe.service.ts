import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Logger } from '../../../common';

@Injectable({
  providedIn: 'root'
})
export class SimpleSwipeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private _container: HTMLElement | null = null;
  private _touchStartX = 0;
  private _touchStartY = 0;
  private _isDragging = false;

  //  Initialize simple swipe for a container
  public initialize(container: HTMLElement): void {
    if (!this.isBrowser) return;

    this._container = container;
    this._attachEventListeners();
    Logger.debug('SimpleSwipeService | Initialized');
  }

  // Clean up
  public destroy(): void {
    if (!this.isBrowser || !this._container) return;

    this._detachEventListeners();
    this._container = null;
    Logger.debug('SimpleSwipeService | Destroyed');
  }

  private _attachEventListeners(): void {
    if (!this._container) return;

    this._container.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
    this._container.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
    this._container.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: false });

    // Mouse events for desktop
    this._container.addEventListener('mousedown', this._onMouseDown.bind(this));
    this._container.addEventListener('mousemove', this._onMouseMove.bind(this));
    this._container.addEventListener('mouseup', this._onMouseUp.bind(this));
  }

  private _detachEventListeners(): void {
    if (!this._container) return;

    this._container.removeEventListener('touchstart', this._onTouchStart.bind(this));
    this._container.removeEventListener('touchmove', this._onTouchMove.bind(this));
    this._container.removeEventListener('touchend', this._onTouchEnd.bind(this));
    this._container.removeEventListener('mousedown', this._onMouseDown.bind(this));
    this._container.removeEventListener('mousemove', this._onMouseMove.bind(this));
    this._container.removeEventListener('mouseup', this._onMouseUp.bind(this));
  }

  private _onTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
    this._isDragging = true;

    Logger.debug('SimpleSwipeService | Touch start:', { x: touch.clientX, y: touch.clientY });
  }

  private _onTouchMove(event: TouchEvent): void {
    if (!this._isDragging || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - this._touchStartX;
    const deltaY = touch.clientY - this._touchStartY;

    // Prevent default if horizontal movement
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
    }
  }

  private _onTouchEnd(event: TouchEvent): void {
    if (!this._isDragging) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this._touchStartX;
    const deltaY = touch.clientY - this._touchStartY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    Logger.debug('SimpleSwipeService | Touch end:', { deltaX, deltaY, distance });

    // Check if it's a valid swipe
    if (distance > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        Logger.debug('SimpleSwipeService | Swipe right detected');
        this._onSwipeRight();
      } else {
        Logger.debug('SimpleSwipeService | Swipe left detected');
        this._onSwipeLeft();
      }
    }

    this._isDragging = false;
  }

  private _onMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return;

    this._touchStartX = event.clientX;
    this._touchStartY = event.clientY;
    this._isDragging = true;

    Logger.debug('SimpleSwipeService | Mouse down:', { x: event.clientX, y: event.clientY });
  }

  private _onMouseMove(event: MouseEvent): void {
    if (!this._isDragging) return;

    const deltaX = event.clientX - this._touchStartX;
    const deltaY = event.clientY - this._touchStartY;

    // Prevent default if horizontal movement
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
    }
  }

  private _onMouseUp(event: MouseEvent): void {
    if (!this._isDragging) return;

    const deltaX = event.clientX - this._touchStartX;
    const deltaY = event.clientY - this._touchStartY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    Logger.debug('SimpleSwipeService | Mouse up:', { deltaX, deltaY, distance });

    // Check if it's a valid swipe
    if (distance > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        Logger.debug('SimpleSwipeService | Mouse swipe right detected');
        this._onSwipeRight();
      } else {
        Logger.debug('SimpleSwipeService | Mouse swipe left detected');
        this._onSwipeLeft();
      }
    }

    this._isDragging = false;
  }

  private _onSwipeLeft(): void {
    // Emit custom event
    const event = new CustomEvent('swipeLeft', {
      detail: { direction: 'left' },
      bubbles: true
    });
    this._container?.dispatchEvent(event);
  }

  private _onSwipeRight(): void {
    // Emit custom event
    const event = new CustomEvent('swipeRight', {
      detail: { direction: 'right' },
      bubbles: true
    });
    this._container?.dispatchEvent(event);
  }
}



