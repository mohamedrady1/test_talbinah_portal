import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  onMessage,
  getToken,
  MessagePayload,
  isSupported,
  Messaging
} from 'firebase/messaging';
import { firebaseConfig, firebaseVapidKey } from '../../../../assets/environments/firebase.config';
import { StorageKeys } from '../../../shared';
import { FcmNotificationsFacade } from '../../../domains';

@Injectable({
  providedIn: 'root'
})
export class NotificationFirebaseService {
  private messaging: Messaging | null = null;
  private fcmToken: string | null = null;
  private readonly TOKEN_STORAGE_KEY = StorageKeys.FCM_TOKEN;
  public currentMessage$ = new BehaviorSubject<MessagePayload | null>(null);
  private isWindowFocused = true;

  // Audio settings
  private audio: HTMLAudioElement | null = null;
  // Put a short mp3 in src/assets/sounds/message-notification-sound.mp3 (CORS OK)
  private readonly SOUND_URL = '/assets/sounds/message-notification-sound.mp3';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fcmNotificationsFacade: FcmNotificationsFacade
  ) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Track focus so we don't show system notification while user is on site
        window.addEventListener('focus', () => (this.isWindowFocused = true));
        window.addEventListener('blur', () => (this.isWindowFocused = false));
        // Preload audio
        this.preloadAudio();
      } catch (e) {
        console.warn('[NotificationFirebaseService] init listeners/preload failed', e);
      }
    }
  }

  /**
   * Initialize FCM messaging. If existingToken is provided we will not regenerate.
   */
  public async initialize(existingToken?: string | null): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const supported = await isSupported().catch(() => false);
    if (!supported) {
      console.warn('[NotificationFirebaseService] Firebase messaging not supported');
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      this.messaging = getMessaging(app);

      const stored = this.getStoredToken();
      if (existingToken || stored) {
        this.fcmToken = existingToken || stored;
        if (this.fcmToken) {
          this.storeToken(this.fcmToken);
          this.updateTokenOnBackendIfLoggedIn(this.fcmToken);
        }
        // Start listening for foreground messages always (so currentMessage$ gets events)
        this.startOnMessageListener();
        return;
      }

      // No token yet → request permission & register SW & get token
      const permissionGranted = await this.requestPermission();
      if (permissionGranted) {
        await this.retrieveToken();
        this.startOnMessageListener();
      }
    } catch (err) {
      console.error('[NotificationFirebaseService] initialize error', err);
    }
  }

  private async requestPermission(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId) || !('Notification' in window)) return false;
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (err) {
      console.error('[NotificationFirebaseService] requestPermission', err);
      return false;
    }
  }

  private async retrieveToken(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.messaging) return;
    try {
      // register service worker (if not already) then ask FCM for token with the registration
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
      const token = await getToken(this.messaging, {
        vapidKey: firebaseVapidKey,
        serviceWorkerRegistration: registration
      });
      if (token) {
        this.fcmToken = token;
        this.storeToken(token);
        this.updateTokenOnBackendIfLoggedIn(token);
        console.log('[NotificationFirebaseService] new token:', token);
      } else {
        console.warn('[NotificationFirebaseService] getToken returned no token');
      }
    } catch (err) {
      console.error('[NotificationFirebaseService] retrieveToken error', err);
    }
  }

  private startOnMessageListener(): void {
    if (!isPlatformBrowser(this.platformId) || !this.messaging) return;

    try {
      onMessage(this.messaging, (payload: MessagePayload) => {
        console.log('[NotificationFirebaseService] onMessage payload:', payload);
        this.currentMessage$.next(payload);

        // Field-safety: access payload.data with bracket notation
        const data = payload?.data as any;
        const fromSW = data ? data['fromSW'] : undefined;

        // Foreground presentation rules:
        // - If window focused -> do not show system notification (keep in-app)
        // - If window not focused and message NOT marked as fromSW -> show notification from page
        //   (if fromSW === '1' it means the SW already displayed it)
        if (!this.isWindowFocused && fromSW !== '1') {
          const tag = data ? data['tag'] : undefined;
          if (tag) {
            // try clearing any existing notifications with same tag (service worker registration)
            this.clearNotificationsByTag(tag).catch(err => {
              console.warn('[NotificationFirebaseService] clearNotificationsByTag failed', err);
            });
          }
          this.showNotificationFromPage(payload);
        }

        // Try playing sound (may be blocked until user gesture)
        this.tryPlaySound();
      });
      console.log('[NotificationFirebaseService] foreground listener attached');
    } catch (err) {
      console.error('[NotificationFirebaseService] startOnMessageListener error', err);
    }
  }

  /**
   * Preload audio file to improve chance of playback on incoming message.
   * Browsers may still block playback until a user gesture has occurred.
   */
  private preloadAudio(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      this.audio = new Audio(this.SOUND_URL);
      this.audio.preload = 'auto';
      // attempt to warm cache
      this.audio.load();
    } catch (e) {
      console.warn('[NotificationFirebaseService] preloadAudio', e);
      this.audio = null;
    }
  }

  /**
   * Try to play the preloaded sound. If blocked, logs and returns.
   */
  private tryPlaySound(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.audio) {
      try {
        this.audio = new Audio(this.SOUND_URL);
        this.audio.preload = 'auto';
        this.audio.load();
      } catch (e) {
        console.warn('[NotificationFirebaseService] audio init', e);
        this.audio = null;
      }
    }
    if (!this.audio) return;

    try {
      // restart sound
      try { this.audio.currentTime = 0; } catch { /* ignore */ }
      this.audio.play().catch(err => {
        // expected until user gesture
        console.warn('[NotificationFirebaseService] sound play blocked:', err);
      });
    } catch (e) {
      console.error('[NotificationFirebaseService] tryPlaySound error', e);
    }
  }

  /**
   * Show system notification from the page (only used for foreground when page hidden).
   * Keep this conservative to avoid duplicating SW notifications.
   */
  public showNotificationFromPage(payload: MessagePayload | any): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    if (this.isWindowFocused) return; // do not show if user is on site

    const data = payload?.data as any;
    const title = data?.title || payload?.notification?.title || 'New notification';
    const body = data?.body || payload?.notification?.body || '';
    const tag = data ? data['tag'] : undefined;
    const url = data ? data['click_action'] || data['url'] : undefined;

    const options: NotificationOptions = {
      body,
      icon: data?.icon || payload?.notification?.image || '/assets/icons/icon-72x72.png',
      data: { ...(data ?? {}), url, fromSW: '0' }, // mark fromSW=0 for page-origin
      tag
    };

    try {
      new Notification(title, options);
    } catch (e) {
      console.error('[NotificationFirebaseService] showNotificationFromPage error', e);
    }
  }

  /**
   * Close any existing notifications with the same tag via SW registration.
   */
  private async clearNotificationsByTag(tag: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !navigator.serviceWorker) return;
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) return;
      const notifications = await reg.getNotifications({ tag });
      notifications.forEach(n => {
        try { n.close(); } catch { /* ignore */ }
      });
    } catch (e) {
      console.warn('[NotificationFirebaseService] clearNotificationsByTag', e);
    }
  }

  public getTokenValue(): string | null {
    return this.fcmToken;
  }

  private storeToken(token: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(this.TOKEN_STORAGE_KEY, token);
    } catch (e) {
      console.warn('[NotificationFirebaseService] storeToken failed', e);
    }
  }

  private getStoredToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      return localStorage.getItem(this.TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private getStoredUser(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      return localStorage.getItem(StorageKeys.CURRENT_USER_INFO);
    } catch {
      return null;
    }
  }

  private updateTokenOnBackendIfLoggedIn(token: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.getStoredUser()) return;
    try {
      this.fcmNotificationsFacade.updateFcmNotifications({
        fcm_token: token,
        device_type: 'web'
      }).subscribe({
        next: (res) => console.log('[NotificationFirebaseService] token synced', res),
        error: (err) => console.error('[NotificationFirebaseService] token sync failed', err)
      });
    } catch (e) {
      console.error('[NotificationFirebaseService] updateTokenOnBackendIfLoggedIn error', e);
    }
  }
}
