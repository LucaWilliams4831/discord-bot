const isProduction = process.env.NODE_ENV === 'production';

const BOT_SECRET_TOKEN = process.env.BOT_SECRET_KEY;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const PORT = Number(process.env.PORT) || 8000;

const commandSettings = {
  COMMAND_PREFIX: '!',
  COMMAND_SEPARATOR: ' ',
} as const;

const links = {
  ANNOUNCEMENTS: 'https://discord.gg/EtVFtbV544',
  TASKS_LINK: 'https://gearboxprotocol.notion.site/Gearbox-DAO-23966f122ae4421492819242b30a0e7a',
  CONTRIBUTION_LINK:
    'https://gearboxprotocol.notion.site/Gearbox-DAO-23966f122ae4421492819242b30a0e7a',
  DETAILS_LINK: 'https://docs.gearbox.finance/overview/launch-phases/early-drop',
} as const;

const { DATABASE_URL } = process.env;

export { BOT_SECRET_TOKEN, LOG_LEVEL, PORT, commandSettings, links, DATABASE_URL, isProduction };
