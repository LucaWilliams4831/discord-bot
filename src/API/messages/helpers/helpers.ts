import { Message as DiscordMessage } from 'discord.js';

interface ProperMessageProps {
  author: {
    bot: DiscordMessage['author']['bot'];
  };
  channel: {
    type: DiscordMessage['channel']['type'];
  };
}

const properMessage = (message: ProperMessageProps) => {
  const isBot = message.author.bot;
  const isDm = message.channel.type === 'DM';
  if (isBot || !isDm) return false;
  return true;
};

interface GetIdProps {
  author: { id: DiscordMessage['author']['id'] };
}

const getId = (message: GetIdProps) => {
  const { id } = message.author;
  return id;
};

interface IsFirstMessageProps {
  channel: {
    messages: { fetch: DiscordMessage['channel']['messages']['fetch'] };
  };
}

const LIMIT = 10;

const firstMessageLimit = { limit: LIMIT };

const isFirstMessage = async (message: IsFirstMessageProps) => {
  const messages = await message.channel.messages.fetch(firstMessageLimit);
  const userMessages = messages.filter((msg) => !msg.author.bot);

  return userMessages.size < 2;
};

const exhaustiveCheck =
  (msg: string) =>
  (arg: never): never => {
    throw new Error(`${msg}${arg}`);
  };

export type { ProperMessageProps, GetIdProps, IsFirstMessageProps };
export { properMessage, getId, isFirstMessage, exhaustiveCheck, firstMessageLimit };
