import SftpClient from 'ssh2-sftp-client';
import fs from 'fs';
import path from 'path';
import { config } from './config.mjs';

const sftp = new SftpClient();

const uploadDir = async (localDir, remoteDir) => {
  const files = fs.readdirSync(localDir);
  for (const file of files) {
    const fullPath = path.join(localDir, file);
    const remotePath = `${remoteDir}/${file}`;
    if (fs.statSync(fullPath).isDirectory()) {
      await sftp.mkdir(remotePath, true);
      await uploadDir(fullPath, remotePath);
    } else {
      await sftp.put(fullPath, remotePath);
      console.log(`✅ Uploaded: ${remotePath}`);
    }
  }
};

await sftp.connect({
  host: config.server.host,
  port: config.server.port,
  username: config.server.user,
  // You can use privateKey instead
  password: process.env.SERVER_PASSWORD
});

await uploadDir('./dist', config.server.path);
await sftp.end();
