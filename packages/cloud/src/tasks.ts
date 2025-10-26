import { logger as baseLogger } from '@taskedo/common';

type Logger = typeof baseLogger;

export interface EnqueueTaskRequest {
  tenantId: string;
  taskId: string;
  runId: string;
  targetUrl: string;
  scheduleTime?: string;
  payload?: Record<string, unknown>;
}

export interface CloudTasksClient {
  enqueue(request: EnqueueTaskRequest): Promise<void>;
}

export interface InMemoryQueuedTask extends EnqueueTaskRequest {
  enqueuedAt: string;
}

export class InMemoryCloudTasksClient implements CloudTasksClient {
  private readonly logger: Logger;
  private queue: InMemoryQueuedTask[] = [];

  constructor(logger: Logger = baseLogger.child({ service: 'cloud-tasks' })) {
    this.logger = logger;
  }

  async enqueue(request: EnqueueTaskRequest): Promise<void> {
    const enqueuedAt = new Date().toISOString();
    this.queue.push({ ...request, enqueuedAt });
    this.logger.debug({ request }, 'Enqueued task in memory');
  }

  drain(): InMemoryQueuedTask[] {
    const drained = this.queue;
    this.queue = [];
    return drained;
  }
}

export const createCloudTasksClient = (): CloudTasksClient => new InMemoryCloudTasksClient();
