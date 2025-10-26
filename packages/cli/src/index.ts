import { loadConfig, logger as baseLogger } from '@taskedo/common';
import { Command } from 'commander';

const config = loadConfig();
const logger = baseLogger.child({ service: 'cli' });

const program = new Command();
program.name('taskedo').description('Taskedo CLI').version('0.1.0');

program
  .command('tasks:import')
  .argument('<file>', 'YAML file containing task definitions')
  .option('-t, --tenant <tenantId>', 'Tenant identifier', config.tenancy.defaultTenantId)
  .description('Provision or update tasks from a YAML spec')
  .action(async (file, options) => {
    logger.info({ file, options }, 'Task import not implemented yet');
  });

program
  .command('tasks:pause')
  .argument('<taskId>', 'Task identifier')
  .option('--until <timestamp>', 'Optional ISO timestamp to resume automatically')
  .description('Pause a task (optionally until a specific date)')
  .action(async (taskId, options) => {
    logger.info({ taskId, options }, 'Pause task not implemented yet');
  });

program
  .command('tasks:start')
  .argument('<taskId>', 'Task identifier')
  .description('Resume a paused task immediately or at the provided time')
  .option('--at <timestamp>', 'Optional ISO timestamp to resume')
  .action(async (taskId, options) => {
    logger.info({ taskId, options }, 'Start task not implemented yet');
  });

program
  .command('tasks:force-run')
  .argument('<taskId>', 'Task identifier')
  .option('--time <timestamp>', 'Scheduled time to rerun')
  .description('Force a task execution regardless of retry delays')
  .action(async (taskId, options) => {
    logger.info({ taskId, options }, 'Force run not implemented yet');
  });

program
  .command('status')
  .option('-t, --tenant <tenantId>', 'Tenant identifier', config.tenancy.defaultTenantId)
  .description('Show high-level scheduler and task status')
  .action(async (options) => {
    logger.info({ options }, 'Status command not implemented yet');
  });

program.parseAsync(process.argv).catch((error) => {
  logger.error({ err: error }, 'CLI failed');
  process.exitCode = 1;
});
