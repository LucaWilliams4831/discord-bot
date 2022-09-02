import pino, { Logger } from 'pino';

const initLogger = (level: string): Logger => {
  const logger = pino({ level });
  logger.debug(`Logger created with level: ${level}`);
  return logger;
};

export type { Logger };
export { initLogger };
