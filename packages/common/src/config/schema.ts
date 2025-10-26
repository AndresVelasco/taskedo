import { z } from 'zod';

export const databaseConfigSchema = z.object({
  url: z.string().min(1, 'DATABASE_URL is required'),
  maxConnections: z.number().int().positive().default(10)
});

export const cloudTasksConfigSchema = z.object({
  projectId: z.string().min(1),
  location: z.string().min(1),
  queue: z.string().min(1),
  serviceAccount: z.string().optional()
});

export const schedulerConfigSchema = z.object({
  pollIntervalMs: z.number().int().positive().default(60_000),
  lockTtlMs: z.number().int().positive().default(120_000),
  maxTasksPerTick: z.number().int().positive().default(100)
});

export const tenancyConfigSchema = z.object({
  defaultTenantId: z.string().min(1).default('dev')
});

export const appConfigSchema = z.object({
  env: z.enum(['development', 'test', 'production']).default('development'),
  logLevel: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  database: databaseConfigSchema,
  cloudTasks: cloudTasksConfigSchema,
  scheduler: schedulerConfigSchema,
  tenancy: tenancyConfigSchema
});

export type AppConfig = z.infer<typeof appConfigSchema>;
export type AppConfigInput = z.input<typeof appConfigSchema>;
