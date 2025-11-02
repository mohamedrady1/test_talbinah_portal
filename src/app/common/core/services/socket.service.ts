// src/app/core/infra/socket.service.ts
import { Injectable, NgZone, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../assets/environments/environment';

type ConnectionStatus = 'online' | 'offline' | 'no-internet';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket?: Socket;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly onlineUsers = signal<string[]>([]);
  readonly typingUsers = signal<Record<string, boolean>>({});
  readonly connectionStatus = signal<ConnectionStatus>('offline');

  constructor() {
    if (this.isBrowser) {
      import('socket.io-client').then(({ io }) => {
        this.socket = io(environment.socketUrl, {
          transports: ['websocket'],
        });
        this.listen();
      });
    }
  }

  private listen(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.ngZone.run(() => {
        this.updateConnectionStatus('online');
        console.log('Socket connected:', this.socket?.id);
      });
    });

    this.socket.on('disconnect', reason => {
      this.ngZone.run(() => {
        this.updateConnectionStatus('offline');
        console.warn('Socket disconnected:', reason);
      });
    });

    this.socket.on('user:online', (userId: string) => {
      this.ngZone.run(() => {
        this.onlineUsers.update(users =>
          users.includes(userId) ? users : [...users, userId]
        );
      });
    });

    this.socket.on('user:offline', (userId: string) => {
      this.ngZone.run(() => {
        this.onlineUsers.update(users => users.filter(u => u !== userId));
      });
    });

    this.socket.on('typing', (payload: { conversationId: string; isTyping: boolean }) => {
      this.ngZone.run(() => {
        this.typingUsers.update(state => ({
          ...state,
          [payload.conversationId]: payload.isTyping,
        }));
      });
    });

    this.socket.on('chat:message', (message: any) => {
      this.ngZone.run(() => {
        // Should forward to facade or signal subject
        // e.g., this._messagesSignal.update(...)
      });
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('offline', () => {
        this.ngZone.run(() => this.updateConnectionStatus('no-internet'));
      });

      window.addEventListener('online', () => {
        this.ngZone.run(() => {
          const status = this.socket?.connected ? 'online' : 'offline';
          this.updateConnectionStatus(status);
        });
      });
    }
  }

  private updateConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus.set(status);
  }

  emit<T>(event: string, payload: T): void {
    if (this.isBrowser && this.socket) {
      this.socket.emit(event, payload);
    }
  }

  sendMessage(payload: { conversationId: string; message: string }) {
    this.emit('chat:message', payload);
  }

  emitTyping(conversationId: string, isTyping: boolean) {
    this.emit('typing', { conversationId, isTyping });
  }

  listenToMessages(handler: (message: any) => void): void {
    if (this.isBrowser && this.socket) {
      this.socket.on('chat:message', (message: any) => {
        this.ngZone.run(() => handler(message));
      });
    }
  }
}
