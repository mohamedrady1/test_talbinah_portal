export interface IStoryCard {
  image: string; // Path to the image, e.g., "images/trash/doctor.png"
  title: string; // e.g., "استشارة طبية عامة"
  doctorName: string; // e.g., "د. أحمد مصطفى"
  // Add any other properties your story cards might have, e.g., id, link
  id?: number;
  link?: string;
}

export interface IGlobalStorySliderConfig {
  isButtonsVisible: boolean;
  autoScroll: {
    isEnabled: boolean;
    interval: number; // in milliseconds
  };
}
