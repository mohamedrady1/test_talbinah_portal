// Define types for card layout
export enum CardLayoutType {
  DEFAULT = 'default',
  COLUMN = 'column',
}

// Interface for individual quick access card configuration
export interface IQuickAccessCardConfig {
  id: number;
  moduleName: string;
  title: string;
  description?: string;
  img: string;
  gap?: string;
  type?: CardLayoutType;
  titleColor: string;
  link: string;
  isCommingSoon?: boolean;
  order?: number;


  uploadApps?: boolean;
  isPinned?: boolean;
  isModal?: boolean;
}
