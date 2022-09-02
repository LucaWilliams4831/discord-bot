import * as fs from 'fs';
import * as path from 'path';
import pino from 'pino';
import * as csv from 'fast-csv';

import { UserCsvRow, UsersMergedRow } from './types';

interface User {
  guildId: string;
  joinedTimestamp: number;
  premiumSinceTimestamp: number | null;
  nickname: string | null;
  pending: boolean;
  communicationDisabledUntilTimestamp: number | null;
  userId: string;
  avatar: string | null;
  displayName: string;
  roles: Array<string>;
  avatarURL: string | null;
  displayAvatarURL: string;
}

async function main() {
  const logger = pino();

  const writeStream = fs.createWriteStream('users-merged.csv');

  const allUsers: Array<User> = JSON.parse(fs.readFileSync('all_users.json', 'utf8'));

  fs.createReadStream(path.resolve(__dirname, '../', 'users.csv'))
    .pipe(csv.parse({ headers: true }))
    // pipe the parsed input into a csv formatter
    .pipe(csv.format<UserCsvRow, UsersMergedRow>({ headers: true }))
    // Using the transform function from the formatting stream
    .transform((row, next): void => {
      const { Id, Author, Tokens } = row;
      const [authorName] = Author.split('#');

      const user = allUsers.filter(({ displayName }) => displayName === authorName);
      if (user.length > 1) {
        logger.error(`User: found multiple copies of ${Author} in discord`);
      }
      if (!user || user.length === 0) {
        logger.error(`User: ${Author} not found in discord`);
      }

      const { userId = '' } = user[0] || {};

      return next(null, {
        Id,
        DiscordId: userId,
        Tokens,

        AuthorName: Author,
        AuthorNameEncoded: Buffer.from(Author).toString('base64'),
      });
    })
    .pipe(writeStream)
    .on('end', () => process.exit());
}

main();
