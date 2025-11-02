import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { config } from './config.mjs';

const s3 = new AWS.S3({
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
  region: config.s3.region,
});

const uploadDir = async (dir, bucketPath = '') => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const s3Key = path.join(bucketPath, file).replace(/\\/g, '/');
    if (fs.statSync(fullPath).isDirectory()) {
      await uploadDir(fullPath, s3Key);
    } else {
      const fileContent = fs.readFileSync(fullPath);
      await s3.upload({
        Bucket: config.s3.bucket,
        Key: s3Key,
        Body: fileContent,
        ContentEncoding: file.endsWith('.gz') ? 'gzip' : undefined,
      }).promise();
      console.log(`✅ Uploaded: ${s3Key}`);
    }
  }
};

await uploadDir('./dist');
