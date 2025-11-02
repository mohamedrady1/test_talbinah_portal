import { exec } from 'child_process';
import { config } from './config.mjs';

const cmd = `scp -r ./dist/* ${config.server.user}@${config.server.host}:${config.server.path}`;
exec(cmd, (err, stdout, stderr) => {
  if (err) {
    console.error(`❌ SCP Error: ${stderr}`);
    process.exit(1);
  } else {
    console.log(`✅ SCP Upload Complete:\n${stdout}`);
  }
});
