import { Logger } from 'src/API/logger';
import { initDb, Database, DbConfig } from 'src/API/db';

interface App {
  logger: Logger;
  db: Database;
}

interface AppProps {
  logger: Logger;
  dbConfig: DbConfig;
}

const initApp = async ({ logger, dbConfig }: AppProps): Promise<App> => {
  const db = await initDb(logger, dbConfig);

  logger.info('App created');
  return {
    logger,
    db,
  };
};

export type { App };
export { initApp };
