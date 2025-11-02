export interface IPodcastStory {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  imageUrl: string;
  duration: number; // in seconds
}

export interface IPodcastStoriesResponseDto {
  stories: IPodcastStory[];
}
