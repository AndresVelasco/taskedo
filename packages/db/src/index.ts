import { PrismaClient } from '@prisma/client';
import { getConfig, logger as baseLogger } from '@taskedo/common';

let prisma: PrismaClient | null = null;

export const getPrismaClient = (): PrismaClient => {
  if (prisma) {
    return prisma;
  }

  const config = getConfig();
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: config.database.url
      }
    }
  });

  const logger = baseLogger.child({ service: 'db' });

  prisma.$use(async (params, next) => {
    const start = Date.now();
    const result = await next(params);
    const duration = Date.now() - start;
    logger.debug({ model: params.model, action: params.action, duration }, 'DB query');
    return result;
  });

  return prisma;
};

export const shutdownPrisma = async () => {
  if (!prisma) return;
  await prisma.$disconnect();
  prisma = null;
};
