import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';

import { UserCsvRow, UserTransformedCsvRow } from './types';

const writeStream = fs.createWriteStream('users-transformed.csv');

fs.createReadStream(path.resolve(__dirname, '../', 'users.csv'))
  .pipe(csv.parse({ headers: true }))
  // pipe the parsed input into a csv formatter
  .pipe(csv.format<UserCsvRow, UserTransformedCsvRow>({ headers: true }))
  // Using the transform function from the formatting stream
  .transform((row, next): void => {
    const { Id, Author, Tokens } = row;
    return next(null, {
      discord_id: Author,
      number_in_list: Id,
      tokens: Tokens,
    });
  })
  .pipe(writeStream)
  .on('end', () => process.exit());
