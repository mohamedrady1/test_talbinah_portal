// src/app/domains/notifications/models/notifications-feature.state.ts

import { NotificationsListState, initialNotificationsListState } from './notifications-list.state';
import { NotificationsItemState, initialNotificationsItemState } from './notifications-item.state'; // Make sure this path is correct if you use item state

/**
 * @interface NotificationsFeatureState
 * @description Defines the overall state for the notifications feature.
 */
export interface NotificationsFeatureState {
    allNotifications: NotificationsListState;
    myNotifications: NotificationsListState;
    // If you also have a single selected notification state, add it here:
    selectedNotification?: NotificationsItemState;
}

export const initialNotificationsFeatureState: NotificationsFeatureState = {
    allNotifications: { ...initialNotificationsListState },
    myNotifications: { ...initialNotificationsListState },
    // If you have selectedNotification, initialize it:
    // selectedNotification: { ...initialNotificationsItemState },
};