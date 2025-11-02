import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INotification } from '../interfaces/notification.interface';
import { NotificationTypeEnum } from '../enums/notification-type.enum';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private notificationsSubject = new BehaviorSubject<INotification[]>([]);
    notifications$ = this.notificationsSubject.asObservable();
    private notificationCounter = 0;

    /**
     * Add a new notification
     * @param notification - Notification data
     */
    add(notification: {
        title: string;
        body: string;
        type?: NotificationTypeEnum | string;
        icon?: string;
        life?: number;
        data?: any;
    }) {
        const newNotification: INotification = {
            id: this.notificationCounter++,
            timestamp: new Date(),
            icon: notification.icon || 'images/icons/logo-2.png',
            life: notification.life || 8000,
            ...notification,
        };

        const currentNotifications = this.notificationsSubject.value;
        this.notificationsSubject.next([...currentNotifications, newNotification]);

        // Auto remove after life duration
        setTimeout(() => this.remove(newNotification.id), newNotification.life);
    }

    /**
     * Remove a notification by ID
     * @param id - Notification ID
     */
    remove(id: number) {
        const updatedNotifications = this.notificationsSubject.value.filter((notif) => notif.id !== id);
        this.notificationsSubject.next(updatedNotifications);
    }

    /**
     * Clear all notifications
     */
    clear() {
        this.notificationsSubject.next([]);
    }
}

