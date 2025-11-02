import { IEnvironment } from './environment.type';
import { environment as baseEnvironment } from './environment';

export const liveEnvironment: IEnvironment = {
  ...baseEnvironment,
  host: 'http://app.talbinah.net',
  // apiUrl: 'https://redesign.talbinah.net',
  // apiUrl: 'https://api.dev.talbinah.net',
  apiUrl: 'https://uat.dev.talbinah.net',
  // apiUrl: 'https://api.talbinah.net',
  production: true,
  socketUrl: 'https://your-backend.com',
  agoraAppId: 'b0fc8da1f9304a728076ff96220d3ebb',
  technicalSupportCollection: 'technicalSupportTest', // technicalSupport or technicalSupportTest
  useInMemoryClients: false
};

export const environment: IEnvironment = liveEnvironment;
