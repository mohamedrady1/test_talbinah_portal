import { UserSupportConversationLogFacade } from './../../../domains/technical-support/services/user-support-conversation-log.facade';
import { CustomerAssignChatToHimFacade } from './../../../domains/technical-support/services/customer-assign-chat-to-him.facade';
import { UserAddChatToHimFacade } from './../../../domains/technical-support/services/user-add-chat-to-him.facade';
import { SendNotificationFacade } from './../../../domains/settings/services/send-notification.facade';
import { Injectable, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  query,
  orderBy,
  CollectionReference
} from '@angular/fire/firestore';
import { getDocs, updateDoc, setDoc, where, QuerySnapshot, serverTimestamp, limit } from 'firebase/firestore';
import { ITechnicalSupportChatDto, ISupportMessageModel, IUserSupportConversationLogRequestDto } from '../../../domains/technical-support';
import { IGlobalReservationModel } from '../../../domains/appointments/models';
import { environment } from '../../../../assets/environments/environment';
import { ISendMeetingChatItem, ReservationHomeworkFacade } from '../../../domains';
import { Observable, of, catchError, tap, map } from 'rxjs';
import { Logger } from '../utilities';

export interface ReservationUser { id: string | number | null; }
export interface ReservationDoctor { id: string | number | null; }
export interface ReservationModel { user?: ReservationUser; doctor?: ReservationDoctor; }
export interface SupportConversationModel { sender_id: number | null; receiver_id: number | null; conversation_id: number | null; }
export enum EventType {
  ended = 'ended',
  started = 'started',
  transferred = 'transferred',
  assigned = 'assigned',
  unknown = 'unknown',
}


@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private readonly firestore = inject(Firestore);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly sendNotificationFacade = inject(SendNotificationFacade);
  private readonly _UserSupportConversationLogFacade = inject(UserSupportConversationLogFacade);
  private readonly _reservationHomeworkFacade = inject(ReservationHomeworkFacade);
  readonly isConnected: WritableSignal<boolean> = signal(false);

  private static readonly CHATS_COLLECTION = 'Chat';
  private static readonly TECH_SUPPORT_CHATS_COLLECTION: string =
    environment.technicalSupportCollection ?? '';
  private static readonly MESSAGES_COLLECTION = 'messages';

  private readonly _UserAddChatToHimFacade = inject(UserAddChatToHimFacade);
  private readonly _CustomerAssignChatToHimFacade = inject(CustomerAssignChatToHimFacade);


  constructor() {
    if (!this.isBrowser) return;

    this.checkConnection().subscribe(connected => this.isConnected.set(connected));
  }

  private getChatId(reservation: ReservationModel): string | null {
    const doctorId = reservation.doctor?.id;
    const userId = reservation.user?.id;
    return doctorId && userId ? `${doctorId}-${userId}` : null;
  }

  private getChatMessagesRef(reservation: ReservationModel): CollectionReference<any> | null {
    const chatId = this.getChatId(reservation);
    if (!chatId) return null;
    return collection(doc(this.firestore, FirestoreService.CHATS_COLLECTION, chatId), FirestoreService.MESSAGES_COLLECTION);
  }

  getMessages(reservation: ReservationModel, myId: string): Observable<ISendMeetingChatItem[]> {
    if (!this.isBrowser) return of([]);

    const messagesRef = this.getChatMessagesRef(reservation);
    if (!messagesRef) return of([]);

    const q = query(messagesRef, orderBy('msgTime', 'asc'));
    return collectionData(q, { idField: 'id' }).pipe(
      tap(msgs => {
        Logger.debug(`Fetched ${msgs.length} messages`);
        this.markUnreadMessagesAsRead(messagesRef, msgs as any, myId); // 🔄 mark unread
        // this.markUnreadMessagesAsOpened(messagesRef, msgs as any, myId); // 🔄 mark unopened for articles
      }),
      catchError(err => {
        Logger.error('Failed to fetch messages', err);
        return of([]);
      })
    );
  }

  checkConnection(): Observable<boolean> {
    if (!this.isBrowser) return of(false);
    try {
      const ref = collection(this.firestore, '__connection_check');
      return collectionData(ref).pipe(
        tap(() => Logger.debug('Firestore reachable')),
        catchError(() => of(false))
      ) as Observable<boolean>;
    } catch {
      return of(false);
    }
  }

  async sendMessage(
    reservation: ReservationModel,
    message: Omit<ISendMeetingChatItem, 'id' | 'msgTime' | 'isRead' | 'isMessageOpened'>,
    reservationData?: IGlobalReservationModel | null
  ) {
    if (!this.isBrowser) return;

    const messagesRef = this.getChatMessagesRef(reservation);
    if (!messagesRef) return;

    const now = Date.now();

    // generate a new document reference with an ID
    const newDocRef = doc(messagesRef);
    const payload: ISendMeetingChatItem = {
      ...message,
      id: newDocRef.id, // ✅ include Firestore ID inside payload
      msgTime: now,
      timestamp: serverTimestamp() as any,
      is_read: '0',
      isMessageOpened: '0'
    };

    try {
      await setDoc(newDocRef, payload);
      Logger.debug('Message sent with ID:', payload.id);

      // Push notification
      if (reservation.user?.id && reservation.doctor?.id) {
        const body =
          message.msgType === 'text' ? message.message || 'رسالة جديدة' :
            message.msgType === 'image' ? 'صورة جديدة' :
              message.msgType === 'document' ? 'ملف جديد' :
                message.msgType === 'video' ? 'فيديو جديد' :
                  message.msgType === 'voice' ? 'رسالة صوتية جديدة' :
                    message.msgType === 'podcast' ? 'ملف بودكاست جديد' : 'رسالة جديدة';

        this.sendNotificationFacade.sendNotification({
          user_id: Number(reservation.doctor.id),
          title: reservationData?.user?.full_name || 'مستخدم',
          body,
          action: 'CHAT',
          model_id: Number(reservationData?.id)
        });
      }
    } catch (err) {
      Logger.error('Failed to send message', err);
    }
  }

  async markChatMeetingMessageAsOpened(
    reservation: ReservationModel,
    messageId: string,
  ): Promise<void> {
    try {
      if (!this.isBrowser) return;

      const messagesRef = this.getChatMessagesRef(reservation);
      if (!messagesRef) return;

      await updateDoc(doc(messagesRef, messageId), { isMessageOpened: '1' });
      Logger.debug(`Marked message ${messageId} as opened with isMessageOpened set to 1`);
    } catch (err) {
      Logger.error(`Failed to mark message ${messageId} as opened`, err);
    }
  }
  async markHomeworkChatMeetingMessageAsOpened(
    reservation: ReservationModel,
    homeworkId: number,
    isTasksModal?: boolean
  ): Promise<void> {
    try {
      if (!this.isBrowser) return;

      const messagesRef = this.getChatMessagesRef(reservation);
      if (!messagesRef) return;

      // Use a query to find the document with the matching homeworkId
      const q = query(messagesRef, where("homeworkId", "==", homeworkId));
      const querySnapshot = await getDocs(q);

      // Check if a document was found
      if (!querySnapshot.empty) {
        // Get the first document from the query results
        const docToUpdate = querySnapshot.docs[0];
        const messageId = docToUpdate.id;

        // Update the document
        this._reservationHomeworkFacade.reviewHomework(homeworkId, isTasksModal);

        await updateDoc(doc(messagesRef, messageId), { isMessageOpened: '1' });
        Logger.debug(`Marked message for homeworkId ${homeworkId} as opened`);
      } else {
        Logger.warn(`No message found with homeworkId ${homeworkId}`);
      }
    } catch (err) {
      Logger.error(`Failed to mark message for homeworkId ${homeworkId} as opened`, err);
    }
  }

  async deleteMessage(reservation: ReservationModel, message: ISendMeetingChatItem) {
    if (!this.isBrowser) return;
    const messagesRef = this.getChatMessagesRef(reservation);
    if (!messagesRef) return;
    try {
      const snapshot: QuerySnapshot<any> = await getDocs(query(messagesRef, where('msgTime', '==', message.msgTime)));
      await Promise.all(snapshot.docs.map(docSnap => updateDoc(docSnap.ref, { msgType: message.msgType })));
      Logger.debug(`Deleted ${snapshot.docs.length} message(s)`);
    } catch (err) { Logger.error('Failed to delete message', err); }
  }

  async updateMessageCustomFields(
    reservation: ReservationModel,
    messageId: string,
    fields: Record<string, any>
  ): Promise<void> {
    if (!this.isBrowser) return;
    const messagesRef = this.getChatMessagesRef(reservation);
    if (!messagesRef) return;
    try {
      await updateDoc(doc(messagesRef, messageId), fields);
      Logger.debug(`Updated message ${messageId} with fields`, fields);
    } catch (err) {
      Logger.error(`Failed to update message ${messageId}`, err);
    }
  }

  async updateMessageCustomFieldsByAssignmentId(
    reservation: ReservationModel,
    assignment_id: string,
    fields: Record<string, any>
  ): Promise<void> {
    if (!this.isBrowser) return;
    const messagesRef = this.getChatMessagesRef(reservation);
    if (!messagesRef) return;
    try {
      // ✅ FIX: Convert the assignment_id string to a number for the query.
      // Firestore queries are type-sensitive, and the homeworkId field is a number.
      const assignmentIdNumber = Number(assignment_id);

      // Create a query to find the document by homeworkId
      const q = query(messagesRef, where("homeworkId", "==", assignmentIdNumber));
      const querySnapshot = await getDocs(q);

      // Check if a document with the given homeworkId exists
      if (!querySnapshot.empty) {
        // Get the first document found
        const messageDoc = querySnapshot.docs[0];

        // Update the document using its ID
        await updateDoc(doc(messagesRef, messageDoc.id), fields);
        Logger.debug(`Updated message with assignment_id ${assignmentIdNumber} with fields`, fields);
      } else {
        Logger.warn(`No message found with assignment_id: ${assignment_id}`);
      }
    } catch (err) {
      Logger.error(`Failed to update message with assignment_id ${assignment_id}`, err);
    }
  }
  getTechSupportMessages(conversationId: string, myId: string): Observable<ISupportMessageModel[]> {
    if (!this.isBrowser) return of([]);

    const messagesRef = this.getSupportChatMessagesRef(conversationId);
    if (!messagesRef) return of([]);

    Logger.debug(`Fetch support messages:`, { messagesRef, conversationId });

    return collectionData(
      query(messagesRef, orderBy('timestamp', 'asc')),
      { idField: 'id' }
    ).pipe(
      tap(msgs => {
        Logger.debug(`Fetched ${msgs.length} support messages`);
        this.markUnreadMessagesAsRead(messagesRef, msgs, myId);
      }),
      catchError(err => {
        Logger.error('Failed to fetch support messages', err);
        return of([]);
      })
    );
  }

  private getSupportChatMessagesRef(conversationId: string): CollectionReference<any> | null {
    if (!conversationId || !FirestoreService.TECH_SUPPORT_CHATS_COLLECTION) return null;
    return collection(doc(this.firestore, FirestoreService.TECH_SUPPORT_CHATS_COLLECTION, conversationId), FirestoreService.MESSAGES_COLLECTION);
  }

  async sendSupportMessage(
    conversationModel: SupportConversationModel,
    message: Omit<ISupportMessageModel, 'id' | 'timestamp'>,
    conversationData?: ITechnicalSupportChatDto | null,
    isSupport?: boolean
  ) {
    if (!this.isBrowser) return;

    const messagesRef = this.getSupportChatMessagesRef(String(conversationData?.id));
    if (!messagesRef) return;

    const now = Date.now();

    // generate new doc with ID
    const newDocRef = doc(messagesRef);
    const payload: ISupportMessageModel = {
      ...message,
      id: newDocRef.id, // ✅ include Firestore ID inside payload
      msgTime: now,
      is_read: '0',
      timestamp: serverTimestamp() as any
    };

    try {
      await setDoc(newDocRef, payload);
      Logger.debug('Support message sent with ID:', payload.id);

      const snapshot = await getDocs(messagesRef);
      const msgsCount = snapshot.size;

      if (msgsCount <= 2 && conversationData?.id) {
        if (isSupport) {
          await this._CustomerAssignChatToHimFacade.assignToSelf(conversationData?.id);
        } else {
          await this._UserAddChatToHimFacade.addChatToSelf(conversationData?.id);
        }
        Logger.debug(`Conversation ${conversationData.id} auto-assigned (msgs: ${msgsCount})`);
      }

      let sendConversationLogPayload: IUserSupportConversationLogRequestDto = {
        sender_id: conversationModel.sender_id ?? 0,
        receiver_id: conversationModel.receiver_id ?? null,
        message: message.message || '',
        conversation_id: conversationData?.id ? Number(conversationData.id) : 0
      };
      this._UserSupportConversationLogFacade.sendConversationLog(
        sendConversationLogPayload
      );
      if (conversationModel.sender_id) {
        const body =
          message.msgType === 'text'
            ? message.message || 'رسالة جديدة'
            : message.msgType === 'image'
              ? '📷 صورة جديدة'
              : 'رسالة جديدة';

        this.sendNotificationFacade.sendNotification({
          user_id: Number(conversationModel.receiver_id),
          title: conversationData?.user_id?.full_name || 'مستخدم',
          body,
          action: 'SUPPORT',
          model_id: Number(conversationData?.id),
        });
      }
    } catch (err) {
      Logger.error('Failed to send support message', err);
    }
  }

  private async markUnreadMessagesAsRead<T extends { id: string; senderId: string; is_read: '0' | '1'; }>(
    messagesRef: CollectionReference,
    msgs: T[],
    myId: string
  ): Promise<void> {
    const unread = msgs.filter(m => m.senderId !== myId && m.is_read === '0');

    for (const msg of unread) {
      try {
        await updateDoc(doc(messagesRef, msg.id), { is_read: '1' });
        Logger.debug(`Marked message ${msg.id} as read`);
      } catch (err) {
        Logger.error(`Failed to mark message ${msg.id} as read`, err);
      }
    }
  }

  private async markUnreadMessagesAsOpened<T extends { id: string; senderId: string; isMessageOpened?: '0' | '1'; }>(
    messagesRef: CollectionReference,
    msgs: T[],
    myId: string
  ): Promise<void> {
    // Only process messages that have isMessageOpened field and are unopened
    const unopened = msgs.filter(m =>
      m.senderId !== myId &&
      m.isMessageOpened !== undefined &&
      m.isMessageOpened === '0'
    );

    for (const msg of unopened) {
      try {
        await updateDoc(doc(messagesRef, msg.id), { isMessageOpened: '1' });
        Logger.debug(`Marked message ${msg.id} as opened`);
      } catch (err) {
        Logger.error(`Failed to mark message ${msg.id} as opened`, err);
      }
    }
  }

  async sendSupportEvent(
    conversationModel: SupportConversationModel,
    conversationData: ITechnicalSupportChatDto | null,
    eventType: EventType,
    message: Omit<ISupportMessageModel, 'id' | 'timestamp'>
  ): Promise<void> {
    if (!this.isBrowser) return;

    const messagesRef = this.getSupportChatMessagesRef(String(conversationData?.id));
    if (!messagesRef) return;

    const newDocRef = doc(messagesRef);
    const now = Date.now();

    const payload: ISupportMessageModel = {
      ...message,
      id: newDocRef.id,
      msgType: 'event',
      eventType,
      msgTime: now,
      is_read: '0',
      timestamp: serverTimestamp() as any
    };

    Logger.debug('sendSupportEvent -> payload:', payload);

    try {
      await setDoc(newDocRef, payload);
      Logger.debug(`Event "${eventType}" sent with ID: ${payload.id}`);

      // 🔔 Send notification (same logic as sendSupportMessage)
      if (conversationModel.sender_id && conversationModel.receiver_id) {
        let body: string;

        switch (eventType) {
          case EventType.assigned:
            body = 'تم تعيين المحادثة';
            break;
          case EventType.transferred:
            body = 'تم تحويل المحادثة';
            break;
          case EventType.ended:
            body = 'تم إنهاء المحادثة';
            break;
          case EventType.started:
            body = 'بدأت محادثة جديدة';
            break;
          default:
            body = 'حدث جديد في المحادثة';
        }

        let sendConversationLogPayload: IUserSupportConversationLogRequestDto = {
          sender_id: conversationModel.sender_id ?? 0,
          receiver_id: conversationModel.receiver_id ?? 0,
          message: message.message || '',
          conversation_id: conversationData?.id ? Number(conversationData.id) : 0
        };
        this._UserSupportConversationLogFacade.sendConversationLog(
          sendConversationLogPayload
        );

        this.sendNotificationFacade.sendNotification({
          user_id: Number(conversationModel.receiver_id),
          title: conversationData?.user_id?.full_name || 'مستخدم',
          body,
          action: 'SUPPORT',
          model_id: Number(conversationData?.id),
        });
      }
    } catch (err) {
      Logger.error('Failed to send support event', err);
    }
  }

  async getMentalHealthResultByHomeworkId(
    reservation: ReservationModel,
    homeworkId: number
  ): Promise<{ score: number; isNotEmpty: boolean } | null> {
    if (!this.isBrowser) {
      Logger.warn('Cannot fetch mental health result, not in a browser environment.');
      return null;
    }

    const messagesRef = this.getChatMessagesRef(reservation);
    if (!messagesRef) {
      Logger.error('Failed to get chat messages reference.');
      return null;
    }

    try {
      // 1. Create a query to find the document with the matching homeworkId
      const q = query(
        messagesRef,
        where('homeworkId', '==', homeworkId),
        limit(1) // 2. Limit the query to one document for efficiency
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // 3. Get the data from the first document found
        const docData = querySnapshot.docs[0].data();

        // 4. Return the specific mentalHealthResult field, or null if it doesn't exist
        return docData['mentalHealthResult'] ?? null;
      } else {
        Logger.warn(`No message found with homeworkId: ${homeworkId}`);
        return null;
      }
    } catch (err) {
      Logger.error(`Failed to retrieve mental health result for homeworkId ${homeworkId}`, err);
      return null;
    }
  }

  findLatestMessageByHomeworkId(
    reservation: ReservationModel,
    assignmentId: string | number,
    myId: string
  ): Observable<ISendMeetingChatItem | null> {
    return this.getMessages(reservation, myId).pipe(
      map(messages => {
        const homeworkMessages = messages.filter(message => String((message as any).homeworkId) === String(assignmentId));
        if (homeworkMessages.length === 0) return null;
        return homeworkMessages[homeworkMessages.length - 1];
      })
    );
  }

}
