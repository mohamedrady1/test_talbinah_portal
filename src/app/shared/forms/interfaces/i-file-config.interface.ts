// 🔹 File Upload Configuration
export interface IFileConfig {
  multiple?: boolean;
  allowedExtensions?: string[];
  keepFile?: boolean;
  previewImg?: boolean;
  resize?: boolean;
  dimensions?: { width: number; height: number };
}
