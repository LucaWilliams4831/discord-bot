import { Client, Intents, ClientOptions } from 'discord.js';
import pino from 'pino';
import * as fs from 'fs';
import { BOT_SECRET_TOKEN } from 'src/config';

const botConfig: ClientOptions = {
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  partials: ['CHANNEL'],
};

const GUILD_ID = '841203475606011905';

async function main() {
  const logger = pino();

  const client = new Client(botConfig);
  await client.login(BOT_SECRET_TOKEN);
  logger.info('Logged in');

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    logger.info('Guild not found');
    return;
  }

  const members = await guild.members.fetch();
  const arrayMembers = members.map((v) => v);

  fs.writeFileSync('all_users.json', JSON.stringify(arrayMembers));
  logger.info('Done');
  process.exit();
}

main();
