import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { QueryResult } from 'pg';
import pino from 'pino';
import { createDbInstance } from 'src/API/db/instance';
import { User } from 'src/API/db/instance/actions/actions';
import { queries } from 'src/API/db/instance/queries';
import { DATABASE_URL } from 'src/config';

import { UsersMergedRow } from './types';

async function main() {
  const logger = pino();

  const { instance } = await createDbInstance(logger, {
    databaseUrl: DATABASE_URL,
  });

  logger.info('Start changing');
  fs.createReadStream(path.resolve(__dirname, '../', 'users-merged.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('data', async ({ AuthorName, Tokens, DiscordId, AuthorNameEncoded }: UsersMergedRow) => {
      const res: QueryResult<User> = await instance.pool.query(`${queries.getUser};`, [
        AuthorNameEncoded,
      ]);

      if (res.rows.length !== 1) {
        logger.error(
          `User: ${AuthorName}, with encoded name: ${AuthorNameEncoded} not found in db`,
        );
        return;
      }

      const formattedTokens = Number(Tokens.replace(',', '').replace('"', ''));

      if (res.rows[0].tokens !== formattedTokens) {
        logger.error(
          `User: ${AuthorName}, with encoded name: ${AuthorNameEncoded} has wrong tokens amount: expected: ${formattedTokens}, but got: ${res.rows[0].tokens}`,
        );
        return;
      }

      const updateRes: QueryResult<User> = await instance.pool.query(`${queries.updateUser};`, [
        AuthorNameEncoded,
        DiscordId,
      ]);

      if (updateRes.rows.length !== 1) {
        logger.error(`User: ${AuthorName}, with id: ${DiscordId} not updated`);
      }
    });
}

main();
