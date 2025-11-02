import { environment } from '../../../../../assets/environments/environment';
import { LogLevel } from './log-level.enum';

export class Logger {
  private static logLevel: LogLevel = environment.logLevel;

  // Function to set the logging level (can be used for production vs development environments)
  static setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  static getLogLevel(): LogLevel {
    return Logger.logLevel;
  }

  private static shouldLog(level: LogLevel): boolean {
    const levels: { [key in LogLevel]: number } = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3
    };

    return levels[level] >= levels[this.logLevel];
  }

  private static generateLogPrefix(level: LogLevel): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]: `;
  }

  static info(...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.generateLogPrefix(LogLevel.INFO), ...args);
    }
  }

  static warn(...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.generateLogPrefix(LogLevel.WARN), ...args);
    }
  }

  static error(...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.generateLogPrefix(LogLevel.ERROR), ...args);
    }
  }

  static debug(...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.info(this.generateLogPrefix(LogLevel.DEBUG), ...args);
    }
  }
}
