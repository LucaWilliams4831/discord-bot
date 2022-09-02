import { QueryResult } from 'pg';
import { queries } from '../queries';
import type { DbInstance } from '..';

interface Exists {
  exists: boolean;
}

const checkUserInSnapshot = (db: DbInstance) => async (id: string) => {
  db.logger.debug('Checking user in snapshot...');
  const res: QueryResult<Exists> = await db.pool.query(`${queries.checkExistenceInUsers};`, [id]);
  return res.rows[0].exists;
};

const checkUserInApplied = (db: DbInstance) => async (id: string) => {
  db.logger.debug('Checking user in applied users...');
  const res: QueryResult<Exists> = await db.pool.query(`${queries.checkExistenceInAppliedUsers};`, [
    id,
  ]);
  return res.rows[0].exists;
};

interface User {
  discord_id: string;
  number_in_list: number;
  tokens: number;
}

const getUser = (db: DbInstance) => async (id: string) => {
  db.logger.debug('Getting user...');
  const res: QueryResult<User> = await db.pool.query(`${queries.getUser};`, [id]);
  return res.rows[0];
};

const insertAppliedUser = (db: DbInstance) => async (id: string, address: string) => {
  db.logger.debug('Inserting user...');
  await db.pool.query(`${queries.insertToAppliedUsers};`, [id, address]);
};

const isReady = (db: DbInstance) => async () => {
  db.logger.debug('Pinging...');
  const res: QueryResult<Exists> = await db.pool.query(`${queries.userTableExists};`);
  return res.rows[0].exists;
};

export type { User, Exists };
export { checkUserInSnapshot, checkUserInApplied, insertAppliedUser, isReady, getUser };
