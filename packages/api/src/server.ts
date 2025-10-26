import { loadConfig, logger as baseLogger } from '@taskedo/common';
import cors from 'cors';
import express from 'express';

const config = loadConfig();
const logger = baseLogger.child({ service: 'api' });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    env: config.env,
    timestamp: new Date().toISOString()
  });
});

app.get('/tasks', (_req, res) => {
  res.json({ data: [], message: 'Task listing not implemented yet' });
});

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  logger.info({ port }, 'API server listening');
});
