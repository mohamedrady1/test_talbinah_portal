import { LogLevel } from '../../app/common/core/utilities/logging/log-level.enum';

export interface IEnvironment {
  host: string;
  apiUrl: string;
  production: boolean;
  logLevel: LogLevel;
  socketUrl: string;
  agoraAppId: string;
  technicalSupportCollection?: string;
  useInMemoryClients: boolean;
}
