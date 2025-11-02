import { IPaginationParameters } from '../../../common';
import { ICommunityNotification } from '../dtos';

export interface CommunityNotificationsListState {
  response: ICommunityNotification[];
  pagination: IPaginationParameters;
  isLoading: boolean;
  isFiltering: boolean;
  errorMessage: string | null;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  status: boolean;
}

export interface CommunityNotificationsFeatureState {
  notifications: CommunityNotificationsListState;
}

/**
 * Initial state for the posts list.
 */
export const initialCommunityNotificationsListState: CommunityNotificationsListState = {
  response: [],
  pagination: { page: 1, per_page: 5 }, // Default pagination
  isLoading: false,
  isFiltering: false,
  errorMessage: null,
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
  status: false
};

/**
 * Initial state for the entire community posts feature.
 */
export const initialCommunityNotificationsFeatureState: CommunityNotificationsFeatureState = {
  notifications: initialCommunityNotificationsListState,
};

