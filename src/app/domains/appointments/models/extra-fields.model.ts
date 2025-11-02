export interface VideoExtraFields {
  videoDuration: number;
  thumbnailVideoImage: string;
}

export type ExtraFields = VideoExtraFields | Record<string, never>;
