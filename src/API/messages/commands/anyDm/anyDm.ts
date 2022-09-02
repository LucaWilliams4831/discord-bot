import { Message as DiscordMessage } from 'discord.js';
import { App } from 'src/app';
import { UserStatus } from 'src/API/db';
import { getId, exhaustiveCheck, GetIdProps } from '../../helpers/helpers';
import { messages } from './messages';

const checkStatus = exhaustiveCheck('Wrong user status: ');

interface ReplyOnStatusProps {
  reply: DiscordMessage['reply'];
}

const replyOnStatus = (message: ReplyOnStatusProps, status: UserStatus) => {
  switch (status) {
    case UserStatus.IN_SNAPSHOT:
      message.reply(messages.inSnapshot);
      return;
    case UserStatus.NOT_IN_SNAPSHOT:
      message.reply(messages.notInSnapshot);
      return;
    case UserStatus.APPLIED:
      message.reply(messages.applied);
      return;
    default:
      checkStatus(status);
  }
};

interface AnyDmProps {
  app: App;
  message: GetIdProps & ReplyOnStatusProps;
}

const anyDm = async ({ app, message }: AnyDmProps) => {
  const id = getId(message);
  app.logger.debug(`Got a DM from: ${id}`);

  const status = await app.db.checkUser(id);

  replyOnStatus(message, status);
};

export type { AnyDmProps, ReplyOnStatusProps };
export { anyDm, replyOnStatus };
