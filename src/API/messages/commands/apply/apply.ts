import { utils } from 'ethers';
import { App } from 'src/app';
import { UserStatus } from 'src/API/db';
import { replyOnStatus, ReplyOnStatusProps } from '../anyDm/anyDm';
import { getId, GetIdProps } from '../../helpers/helpers';
import { messages } from './messages';

const { isAddress } = utils;

interface ApplyProps {
  app: App;
  message: GetIdProps & ReplyOnStatusProps;
  address: string;
}

const apply = async ({ app, message, address: userAddress }: ApplyProps) => {
  app.logger.debug(`Got address command with address: ${userAddress}`);

  const id = getId(message);
  const status = await app.db.checkUser(id);

  if (status !== UserStatus.IN_SNAPSHOT) {
    replyOnStatus(message, status);
  } else {
    const addressOk = isAddress(userAddress);
    if (!addressOk) {
      message.reply(messages.wrongAddress);
      return;
    }
    const { tokens } = await app.db.addUser(id, userAddress);
    message.reply(messages.success(tokens));
  }
};

export type { ApplyProps };
export { apply };
