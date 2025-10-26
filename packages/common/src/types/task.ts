export type TaskType = 'url';

export type BackfillPolicy = 'ascending' | 'descending';

export interface TaskDependencyPolicyBase {
  kind: 'truncation' | 'dateMask' | 'offset';
}

export interface TruncationDependencyPolicy extends TaskDependencyPolicyBase {
  kind: 'truncation';
  truncateTo: 'minute' | 'hour' | 'day' | 'month';
}

export interface DateMaskDependencyPolicy extends TaskDependencyPolicyBase {
  kind: 'dateMask';
  mask: string; // ex: yyyy-mm
}

export interface OffsetDependencyPolicy extends TaskDependencyPolicyBase {
  kind: 'offset';
  offsetMinutes: number;
}

export type TaskDependencyPolicy =
  | TruncationDependencyPolicy
  | DateMaskDependencyPolicy
  | OffsetDependencyPolicy;

export interface TaskDependency {
  upstreamTaskId: string;
  policy: TaskDependencyPolicy;
}

export interface TaskDefinition {
  id: string;
  tenantId: string;
  name: string;
  type: TaskType;
  targetUrl: string;
  cronSchedule: string;
  beginDate?: string;
  backfillLimit: number;
  taskTimeoutSeconds: number;
  stopOnError: boolean;
  maxParallelRuns: number;
  backfillPolicy: BackfillPolicy;
  createdAt: string;
  updatedAt: string;
  dependencies?: TaskDependency[];
}

export type TaskRunStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';

export interface TaskRun {
  id: string;
  taskId: string;
  tenantId: string;
  scheduledTime: string;
  startedAt?: string;
  finishedAt?: string;
  status: TaskRunStatus;
  attempt: number;
  lastError?: string;
}
