import { ErrorStateConfig } from '../../../shared';

export function getKhawiikVoiceTypesErrorConfig(onRetry?: () => void): ErrorStateConfig {
  return {
    title: 'khawiik.khawiikVoiceTypes.error.title',
    imgWidth: '30%',
    onRetry: onRetry
  };
}

export function getKhawiikActivitiesErrorConfig(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/emptyStates/image-6.svg',
    title: 'khawiik.activities.error.title',
    gap: '1rem',
    onRetry,
  };
}

export function getKhawiikBooksErrorConfig(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/emptyStates/image-6.svg',
    title: 'khawiik.books.error.title',
    gap: '1rem',
    onRetry,
  };
}

// Error state config for rendering API errors as text-only (no image)
export function getKhawiikVoiceChatErrorConfig(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: null,
    message: 'khawiik.voiceChat.error.message',
    gap: '0.5rem',
    onRetry,
  };
}
// Error state config for rendering API errors as text-only (no image)
export function getKhawiikTextChatErrorConfig(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: null,
    message: 'khawiik.textChat.error.message',
    gap: '0.5rem',
    onRetry,
  };
}


