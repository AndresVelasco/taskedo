import { getConfig, logger as baseLogger } from '@taskedo/common';

const config = getConfig();
const logger = baseLogger.child({ service: 'scheduler' });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const runSchedulerTick = async () => {
  logger.debug('Running scheduler tick (DB + Cloud Tasks wiring pending)');
  // TODO: Read eligible tasks from DB, acquire locks, and enqueue via Cloud Tasks adapter.
};

const startScheduler = async () => {
  logger.info(
    {
      pollIntervalMs: config.scheduler.pollIntervalMs
    },
    'Scheduler starting'
  );

  for (;;) {
    const tickStartedAt = Date.now();
    try {
      await runSchedulerTick();
    } catch (error) {
      logger.error({ err: error }, 'Scheduler tick failed');
    }

    const elapsed = Date.now() - tickStartedAt;
    const delay = Math.max(config.scheduler.pollIntervalMs - elapsed, 100);
    await sleep(delay);
  }
};

startScheduler().catch((error) => {
  logger.fatal({ err: error }, 'Scheduler crashed');
  process.exitCode = 1;
});
