# Deployment Options for Production Builds

This folder contains deployment scripts for three supported methods.  
Pick **one method** based on your infrastructure or DevOps team's preference.

---

## 📦 Deployment Targets

### 1. Amazon S3 (Static Hosting)
- Best for static builds or SPA deployment.
- Supports CloudFront for CDN + SSL.
- No backend or SSR, just static asset hosting.

### 2. SCP (Secure Copy via SSH)
- Good for full server environments (Node.js, SSR).
- Requires SSH access and Node.js (optionally PM2) on the server.
- Directly deploys Angular SSR output (Node server).

### 3. SFTP
- Useful for basic file transfers to shared hosting or VPS.
- Less flexible than SCP but widely supported.
- Typically used for non-SSR/static hosting setups.

---

## 🔐 Configuration

All scripts share credentials/config using:

- [`config.mjs`](./config.mjs): Exports values from environment variables.
- [`.env`](./.env): Stores credentials and paths securely.

Create a `.env` file like the following:

```env
# Amazon S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET=my-angular-app-bucket
S3_REGION=us-east-1

# SCP / SFTP
SERVER_HOST=example.com
SERVER_PORT=22
SERVER_USER=deploy
SERVER_PATH=/var/www/html/my-app


🌐 Nginx Reverse Proxy (Optional)
If your Node SSR app is hosted behind Nginx, use the following:

nginx
location / {
  proxy_pass http://localhost:4000;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
  gzip_proxied any;
}
This ensures:

Faster asset delivery with gzip

SSR routes proxied from port 4000 (or your Node server port)

Better SEO and crawlability


✅ Deployment Flow Summary

# 1. Build & compress
npm run build:artifact

# 2. Upload via your chosen method
npm run upload:s3     # OR
npm run upload:scp    # OR
npm run upload:sftp

# 3. (SSR only) Start server on remote host
pm2 restart angular-ssr
