import { Injectable, PLATFORM_ID, inject, signal, WritableSignal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SocketService } from './socket.service';

interface ChatMessage {
  id: string;
  conversationId: string | number | null;
  senderId: string;
  text: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class SocketChatFacade {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly socket = inject(SocketService);
  private readonly messagesSignal = signal<ChatMessage[]>([]);

  readonly onlineUsers = computed(() => this.socket.onlineUsers());
  readonly typingUsers = computed(() => this.socket.typingUsers());
  readonly connectionStatus = computed(() => this.socket.connectionStatus());

  constructor() {
    if (this.isBrowser) {
      this.initSocketListeners();
    }
  }

  private initSocketListeners(): void {
    this.socket.listenToMessages((message: ChatMessage) => {
      this.messagesSignal.update(messages => [...messages, message]);
    });
  }

  getMessages(): WritableSignal<ChatMessage[]> {
    return this.messagesSignal;
  }

  sendMessage(conversationId: string, message: string): void {
    if (this.isBrowser) {
      this.socket.sendMessage({ conversationId, message });
    }
  }

  emitTyping(conversationId: string, isTyping: boolean): void {
    if (this.isBrowser) {
      this.socket.emitTyping(conversationId, isTyping);
    }
  }

  loadHistory(conversationId: string | number | null): void {
    // Mock API: Replace with actual API call
    const mockHistory: ChatMessage[] = [
      {
        id: '1',
        conversationId,
        senderId: 'doctor',
        text: 'Hello!',
        createdAt: new Date().toISOString()
      }
    ];
    this.messagesSignal.set(mockHistory);
  }
}
