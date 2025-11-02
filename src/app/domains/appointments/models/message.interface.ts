import { FileAttachment } from "./file-attachment.ts.model";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  files: FileAttachment[];
  type: 'text' | 'voice';
  voiceRecordingUrl?: string;
}
