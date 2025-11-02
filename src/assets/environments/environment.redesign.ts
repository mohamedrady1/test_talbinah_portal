import { LogLevel } from '../../app/common/core/utilities/logging/log-level.enum';
import { environment as baseEnvironment } from './environment';
import { IEnvironment } from './environment.type';

export const redesignEnvironment: IEnvironment = {
  ...baseEnvironment,
  host: 'https://portal.dev.talbinah.net',
  // apiUrl: 'https://redesign.talbinah.net',
  // apiUrl: 'https://api.dev.talbinah.net',
  apiUrl: 'https://uat.dev.talbinah.net',
  // apiUrl: 'https://api.talbinah.net',
  logLevel: LogLevel.INFO,
  socketUrl: 'https://your-backend.com',
  agoraAppId: 'b0fc8da1f9304a728076ff96220d3ebb',
  technicalSupportCollection: 'technicalSupportTest', // technicalSupport or technicalSupportTest
  useInMemoryClients: false
};

export const environment: IEnvironment = redesignEnvironment;
