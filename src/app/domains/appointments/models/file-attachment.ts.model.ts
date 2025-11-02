export interface FileAttachment {
  name: string;
  size: number;
  type: string;
  url?: string;
  id?: string | number | null;
}
