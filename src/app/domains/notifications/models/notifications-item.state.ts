// src/app/domains/notifications/models/notifications-item.state.ts

import { INotification } from "./notifications-models";


/**
 * @interface NotificationsItemState
 * @description Represents the state for a single notification item's details.
 */
export interface NotificationsItemState {
  item: INotification | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export const initialNotificationsItemState: NotificationsItemState = {
  item: null,
  isLoading: false,
  errorMessage: null,
};