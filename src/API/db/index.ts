import { Logger } from 'src/API/logger';
import { User } from './instance/actions/actions';
import { createDbInstance, DbInterface, DbConfig } from './instance';
import { checkUser, addUser, isReady, UserStatus } from './handlers/handlers';

interface Database {
  checkUser: (id: string) => Promise<UserStatus>;
  addUser: (id: string, userAddress: string) => Promise<User>;
  isReady: () => Promise<boolean>;
}

const initDb = async (logger: Logger, config: DbConfig): Promise<Database> => {
  const db = await createDbInstance(logger, config);
  logger.info('DB created');

  return {
    checkUser: checkUser(db),
    addUser: addUser(db),
    isReady: isReady(db),
  };
};

export type { Database, DbInterface, DbConfig };
export { initDb, UserStatus };
