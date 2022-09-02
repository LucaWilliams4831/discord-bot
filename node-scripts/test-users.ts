import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { QueryResult } from 'pg';
import pino from 'pino';
import { createDbInstance } from 'src/API/db/instance';
import { User } from 'src/API/db/instance/actions/actions';
import { queries } from 'src/API/db/instance/queries';
import { DATABASE_URL } from 'src/config';

import { UserCsvRow } from './types';

async function main() {
  const logger = pino();

  const { instance } = await createDbInstance(logger, {
    databaseUrl: DATABASE_URL,
  });

  logger.info('Start checking');
  fs.createReadStream(path.resolve(__dirname, '../', 'users.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('data', async ({ Author, Tokens }: UserCsvRow) => {
      const id = Author;

      const res: QueryResult<User> = await instance.pool.query(`${queries.getUser};`, [id]);

      if (res.rows.length !== 1) {
        logger.error(`User: ${Author}, with encoded id: ${id} not found in db`);
        return;
      }

      const formattedTokens = Number(Tokens.replace(',', '').replace('"', ''));

      if (res.rows[0].tokens !== formattedTokens) {
        logger.error(
          `User: ${Author}, with encoded id: ${id} has wrong tokens amount: expected: ${formattedTokens}, but got: ${res.rows[0].tokens}`,
        );
      }
    });
}

main();
