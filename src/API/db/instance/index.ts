import { Pool } from 'pg';
import { Logger } from 'src/API/logger';
import { initTables, connectDb, DbConfig } from './init/init';
import {
  checkUserInSnapshot,
  checkUserInApplied,
  insertAppliedUser,
  isReady,
  getUser,
  User,
} from './actions/actions';

interface DbInstance {
  pool: Pool;
  logger: Logger;
}

interface DbInterface {
  instance: DbInstance;
  actions: {
    checkUserInSnapshot: (id: string) => Promise<boolean>;
    checkUserInApplied: (id: string) => Promise<boolean>;
    insertAppliedUser: (id: string, address: string) => Promise<void>;
    getUser: (id: string) => Promise<User>;
    isReady: () => Promise<boolean>;
  };
}

const createDbInstance = async (logger: Logger, config: DbConfig): Promise<DbInterface> => {
  const pool = await connectDb(logger, config);
  await initTables(pool, logger);

  const instance: DbInstance = {
    pool,
    logger,
  };

  return {
    instance,
    actions: {
      checkUserInSnapshot: checkUserInSnapshot(instance),
      checkUserInApplied: checkUserInApplied(instance),
      insertAppliedUser: insertAppliedUser(instance),
      getUser: getUser(instance),
      isReady: isReady(instance),
    },
  };
};

export type { DbInstance, DbInterface, DbConfig };
export { createDbInstance };
