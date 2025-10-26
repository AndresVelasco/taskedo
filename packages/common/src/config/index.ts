import { config as loadEnv } from 'dotenv';

import type { AppConfig, AppConfigInput } from './schema.js';
import { appConfigSchema } from './schema.js';

loadEnv();

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

let cachedConfig: AppConfig | null = null;

export const buildDefaultConfigInput = (): AppConfigInput => ({
  env: (process.env.NODE_ENV as AppConfigInput['env']) ?? 'development',
  logLevel: (process.env.LOG_LEVEL as AppConfigInput['logLevel']) ?? 'info',
  database: {
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/taskedo',
    maxConnections: Number(process.env.DATABASE_MAX_CONNECTIONS ?? 10)
  },
  cloudTasks: {
    projectId: process.env.CLOUD_TASKS_PROJECT_ID ?? 'local-project',
    location: process.env.CLOUD_TASKS_LOCATION ?? 'us-central1',
    queue: process.env.CLOUD_TASKS_QUEUE ?? 'taskedo-default',
    serviceAccount: process.env.CLOUD_TASKS_SERVICE_ACCOUNT
  },
  scheduler: {
    pollIntervalMs: Number(process.env.SCHEDULER_POLL_INTERVAL_MS ?? 60_000),
    lockTtlMs: Number(process.env.SCHEDULER_LOCK_TTL_MS ?? 120_000),
    maxTasksPerTick: Number(process.env.SCHEDULER_MAX_TASKS_PER_TICK ?? 100)
  },
  tenancy: {
    defaultTenantId: process.env.DEFAULT_TENANT_ID ?? 'dev'
  }
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const deepMerge = <T>(target: T, source?: DeepPartial<T>): T => {
  if (!source) {
    return target;
  }

  const result: Record<string, unknown> = Array.isArray(target)
    ? [...(target as unknown[])]
    : { ...(target as Record<string, unknown>) };

  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue;

    if (isRecord(value) && isRecord(result[key])) {
      result[key] = deepMerge(result[key], value as Record<string, unknown>);
    } else {
      result[key] = value as unknown;
    }
  }

  return result as T;
};

export const loadConfig = (overrides?: DeepPartial<AppConfigInput>): AppConfig => {
  const defaultInput = buildDefaultConfigInput();
  const mergedInput = deepMerge(defaultInput, overrides);
  const parsed = appConfigSchema.parse(mergedInput);
  cachedConfig = parsed;
  return parsed;
};

export const getConfig = (): AppConfig => cachedConfig ?? loadConfig();

export type { AppConfig } from './schema.js';
