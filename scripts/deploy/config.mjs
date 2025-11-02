import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.env')
});

export const config = {
  s3: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION
  },
  server: {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT || 22,
    user: process.env.SERVER_USER,
    path: process.env.SERVER_PATH
  }
};
