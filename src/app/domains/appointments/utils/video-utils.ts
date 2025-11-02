import { isPlatformBrowser } from '@angular/common';
import { VideoExtraFields } from '../models';

export async function extractVideoFieldsFromBlob(
  blob: Blob,
  platformId: Object
): Promise<VideoExtraFields> {
  if (!isPlatformBrowser(platformId)) {
    throw new Error('extractVideoFieldsFromBlob should only run in the browser');
  }

  const video = document.createElement('video');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const videoURL = URL.createObjectURL(blob);

  video.src = videoURL;
  video.muted = true;
  video.playsInline = true;

  // Wait for video metadata
  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error('Failed to load video metadata'));
  });

  const videoDuration = video.duration;

  // Seek to middle frame (duration / 2)
  video.currentTime = videoDuration / 2;

  await new Promise<void>((resolve, reject) => {
    video.onseeked = () => resolve();
    video.onerror = () => reject(new Error('Failed to seek video'));
  });

  // Resize if too large (optional max resolution)
  const maxSize = 320; // px
  const aspectRatio = video.videoWidth / video.videoHeight;
  if (aspectRatio >= 1) {
    canvas.width = maxSize;
    canvas.height = Math.round(maxSize / aspectRatio);
  } else {
    canvas.height = maxSize;
    canvas.width = Math.round(maxSize * aspectRatio);
  }

  ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

  const thumbnailVideoImage = canvas.toDataURL('image/jpeg', 0.7); // Reduce quality

  URL.revokeObjectURL(videoURL);

  return { videoDuration, thumbnailVideoImage };
}
