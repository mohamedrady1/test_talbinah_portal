import { IEnvironment } from './environment.type';
import { LogLevel } from '../../app/common/core/utilities/logging/log-level.enum';

export const UATEnvironment: IEnvironment = {
  host: 'https://portal.dev.talbinah.net',
  // apiUrl: 'https://redesign.talbinah.net',
  // apiUrl: 'https://api.dev.talbinah.net',
  apiUrl: 'https://uat.dev.talbinah.net',
  // apiUrl: 'https://api.talbinah.net',
  logLevel: LogLevel.INFO,
  production: false,
  socketUrl: 'https://your-backend.com',
  agoraAppId: 'b0fc8da1f9304a728076ff96220d3ebb',
  technicalSupportCollection: 'technicalSupportTest',
  useInMemoryClients: false
};

export const environment: IEnvironment = UATEnvironment;
