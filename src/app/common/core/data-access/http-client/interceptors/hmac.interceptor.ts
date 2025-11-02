// import { HttpInterceptorFn } from '@angular/common/http';
// import { environment } from '../../../../../../assets/environment/environment';
// import * as CryptoJS from 'crypto-js';

// export const hmacInterceptor: HttpInterceptorFn = (req, next) => {
//     const httpMethod = req.method;
//     const baseUrl = environment.apiUrl;
//     const requestUrl = req.urlWithParams.startsWith('http')
//         ? new URL(req.urlWithParams)
//         : new URL(req.urlWithParams, baseUrl);
//     const path = requestUrl.pathname; // Extract path from URL

//     // Generate HMAC headers
//     const timestamp = Math.floor(Date.now() / 1000);
//     const userAgent = environment.userAgent;
//     const secretKey = environment.userAgentSecret;

//     if (!secretKey) {
//         throw new Error('Invalid user agent');
//     }

//     const message = `${httpMethod}${path}${timestamp}${userAgent}${httpMethod}`;

//     const hash = CryptoJS.HmacSHA256(message, secretKey);
//     const signature = CryptoJS.enc.Base64.stringify(hash);

//     const clonedRequest = req.clone({
//         setHeaders: {
//             'X-UserAgent': userAgent,
//             'X-Timestamp': timestamp.toString(),
//             'X-Signature': signature
//         }
//     });

//     return next(clonedRequest);
// };
