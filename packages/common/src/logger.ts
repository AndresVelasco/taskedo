import pino from 'pino';
import type { Logger } from 'pino';

import { getConfig } from './config/index.js';

export type LoggerBindings = Record<string, string | number | boolean | undefined>;

export const createLogger = (bindings?: LoggerBindings): Logger => {
  const config = getConfig();
  return pino({
    level: config.logLevel,
    base: {
      service: bindings?.service ?? 'taskedo',
      env: config.env,
      ...bindings
    }
  });
};

export const logger = createLogger();
