import { Client, Intents, ClientOptions } from 'discord.js';
import { App } from 'src/app';
import { onMessage } from 'src/API/messages';

// const allIntents = new Intents(32767);

const botConfig: ClientOptions = {
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
  partials: ['CHANNEL'],
};

interface InitBotProps {
  app: App;
  token: string;
}

const initBot = async ({ app, token }: InitBotProps) => {
  const client = new Client(botConfig);

  client.on('messageCreate', onMessage({ app }));

  await client.login(token);
  app.logger.debug(`Bot logged in with token: ${token}`);

  app.logger.info('Bot created');

  return client;
};

export { initBot };
