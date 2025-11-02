import { INotificationDto } from "../dtos";

export interface NotificationsListState {
  response: INotificationDto[] | null;
  isLoading: boolean;
  isFiltering: boolean;
  isLoadingMore?: boolean;
  errorMessage: string | null;
  state: boolean | null;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  type?: string
}

export const initialNotificationsListState: NotificationsListState = {
  response: null,
  isLoading: false,
  isFiltering: false,
  isLoadingMore: false,
  errorMessage: null,
  state: null,
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
};