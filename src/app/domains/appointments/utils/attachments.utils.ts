import { MeetingChatItemTypes } from '../enums';
import { extractVideoFieldsFromBlob } from './video-utils';
import { extractAudioDurationFromBlob } from './audio-utils';
import { IApiResponse } from '../../../common';

export function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function getPointerY(evt: MouseEvent | TouchEvent): number {
  return evt instanceof MouseEvent ? evt.clientY : evt.touches[0]?.clientY ?? 0;
}

export function inferChatItemType(file: File): MeetingChatItemTypes {
  const mime = file.type;

  if (mime.startsWith('image/')) return MeetingChatItemTypes.IMAGE;
  if (mime.startsWith('video/')) return MeetingChatItemTypes.VIDEO;
  if (mime.startsWith('audio/')) return MeetingChatItemTypes.AUDIO;
  if (mime === 'application/pdf') return MeetingChatItemTypes.VIEW_PDF;
  if (mime === 'text/plain') return MeetingChatItemTypes.TEXT;

  const documentMIMEs = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  if (documentMIMEs.includes(mime)) {
    return MeetingChatItemTypes.DOCUMENT;
  }

  return MeetingChatItemTypes.UNKNOWN;
}

export async function handleUploadFile(file: File, platformId: Object, response: IApiResponse<string[] | null>) {
  const type = inferChatItemType(file);
  const link = (response.data?.[0] ?? URL.createObjectURL(file));

  const baseMeta = { link };

  try {
    if (type === MeetingChatItemTypes.VIDEO) {
      const { videoDuration, thumbnailVideoImage } =
        await extractVideoFieldsFromBlob(file, platformId);

      return {
        ...baseMeta,
        videoDuration,
        thumbnailVideoImage,
      };
    }

    if (type === MeetingChatItemTypes.AUDIO) {
      const recorderTimer = await extractAudioDurationFromBlob(file, platformId);

      return {
        ...baseMeta,
        recorderTimer,
      };
    }
  } catch (err) {
    console.warn(`⚠️ Metadata extraction error for ${type}:`, err);
  }

  return baseMeta;
}
