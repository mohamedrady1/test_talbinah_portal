import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatTitleUpdatedEvent {
    id: number;
    name: string;
}

export interface ChatDeletedEvent {
    id: number;
}

@Injectable({ providedIn: 'root' })
export class ChatEventsService {
    private readonly _titleUpdated$ = new BehaviorSubject<ChatTitleUpdatedEvent | null>(null);
    private readonly _activeChatId$ = new BehaviorSubject<number | null>(null);
    private readonly _chatDeleted$ = new BehaviorSubject<ChatDeletedEvent | null>(null);
    private readonly _lastDeletedId$ = new BehaviorSubject<number | null>(null);

    get titleUpdated$(): Observable<ChatTitleUpdatedEvent | null> {
        return this._titleUpdated$.asObservable();
    }

    emitTitleUpdated(event: ChatTitleUpdatedEvent): void {
        this._titleUpdated$.next(event);
    }

    get chatDeleted$(): Observable<ChatDeletedEvent | null> {
        return this._chatDeleted$.asObservable();
    }

    emitChatDeleted(event: ChatDeletedEvent): void {
        this._chatDeleted$.next(event);
        this._lastDeletedId$.next(event.id);
    }

    setActiveChatId(chatId: number | null): void {
        this._activeChatId$.next(chatId);
    }

    getActiveChatId(): number | null {
        return this._activeChatId$.getValue();
    }

    getLastDeletedId(): number | null {
        return this._lastDeletedId$.getValue();
    }
}


