import { EmptyStateConfig } from "../../../shared";

export const ReservationsEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/appointments.svg',
  title: 'no_appointments_yet',
  message: 'all_appointments_booked_or_unavailable_check_later',
  imgWidth: '38%'
};

export const ReservationsOngoingEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/appointments.svg',
  title: 'no_ongoing_appointments_currently',
  // message: 'all_appointments_booked_or_unavailable_check_later',
  imgWidth: '30%'
};
export const YourReservationsEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/appointments.svg',
  title: 'no_ongoing_appointments_currently',
};

export const ChatMessagesEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/image-11.svg',
  title: 'start_your_conversation_with_the_doctor',
  imgWidth: '38%'
};

export const NoPodcastsInCategoryEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/podcast.svg',
  title: 'podcast_no_podcasts_in_category',
  imgWidth: '20%'
};

// Session Tasks Empty States
export const NoPodcastsTasksEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/podcast.svg',
  title: 'podcast_no_podcasts_general',
  imgWidth: '30%'
};

export const NoArticlesTasksEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/image-6.svg',
  title: 'articles_no_items_state',
  imgWidth: '30%'
};

export const NoMentalHealthTasksEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/image-13.svg',
  title: 'no_results_found',
  imgWidth: '30%'
};

export const NoTasksEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/appointments.svg',
  title: 'no_tasks_available',
  imgWidth: '30%'
};
