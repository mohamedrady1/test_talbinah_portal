import { EmptyStateConfig } from "../../../shared";

export const ReservationsEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/appointments.svg',
  title: 'Appointments.emptyState.no_appointments_available',
  message: 'Appointments.emptyState.subtitle',
  imgWidth: '38%'
};

export const ReservationsOngoingEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/appointments.svg',
  title: 'Appointments.emptyState.noAppointmentsOngoing',
  // message: 'Appointments.emptyState.subtitle',
  imgWidth: '30%'
};
export const YourReservationsEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/appointments.svg',
  title: 'Appointments.emptyState.no_your_appointments_available',
};

export const ChatMessagesEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/image-11.svg',
  title: 'Appointments.chat.welcomeMessage',
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
  title: 'sessionTasks.noPodcastsTasks',
  imgWidth: '30%'
};

export const NoArticlesTasksEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/image-6.svg',
  title: 'sessionTasks.noArticlesTasks',
  imgWidth: '30%'
};

export const NoMentalHealthTasksEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/image-13.svg',
  title: 'sessionTasks.noMentalHealthTasks',
  imgWidth: '30%'
};

export const NoTasksEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/appointments.svg',
  title: 'sessionTasks.noTasksAvailable',
  imgWidth: '30%'
};
