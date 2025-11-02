import { FileType } from "../enums";

export interface DownloadableFile {
  name: string;
  url: string | any;
  type: FileType;
  size?: number | null; // Size in bytes
  date?: Date; // Date of upload or creation
}
