import { Pool, QueryResult } from 'pg';
import { Logger } from 'src/API/logger';
import { allUsers, allTables } from '../queries';

interface DbConfig {
  databaseUrl?: string;
}

const makeConnectionString = ({ databaseUrl }: DbConfig): string => {
  if (!databaseUrl) throw new Error('Database config: No database url');
  return databaseUrl;
};

const connectDb = async (logger: Logger, config: DbConfig): Promise<Pool> => {
  const connectionString = makeConnectionString(config);

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  logger.debug(config, 'Db instance created with config');

  return pool;
};

interface UserCount {
  users_count: string;
  applied_users_count: string;
}

const countUsers = async (pool: Pool) => {
  const res: QueryResult<UserCount> = await pool.query(`${allUsers};`);
  return [Number(res.rows[0].users_count), Number(res.rows[0].applied_users_count)];
};

const initTables = async (pool: Pool, logger: Logger) => {
  await pool.query(`${allTables};`);

  const [count, appliedCount] = await countUsers(pool);
  logger.debug(`Users table count: ${count}; Applied users table count: ${appliedCount}`);
};

export type { DbConfig, UserCount };
export { initTables, connectDb };
