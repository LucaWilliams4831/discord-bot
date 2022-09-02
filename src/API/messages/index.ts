import { App } from 'src/app';
import { apply, ApplyProps } from './commands/apply/apply';
import { anyDm, AnyDmProps } from './commands/anyDm/anyDm';
import {
  properMessage,
  isFirstMessage,
  IsFirstMessageProps,
  ProperMessageProps,
} from './helpers/helpers';

interface OnMessageProps {
  app: App;
}

type KnownCommands = 'apply';

type Message = ApplyProps['message'] &
  AnyDmProps['message'] &
  IsFirstMessageProps &
  ProperMessageProps & { content: string };

const onMessage =
  ({ app }: OnMessageProps) =>
  async (message: Message) => {
    try {
      if (!properMessage(message)) return;

      const isFirst = await isFirstMessage(message);
      app.logger.debug(`Got message. First time: ${isFirst}`);

      if (isFirst) {
        await anyDm({ app, message });
      } else {
        await apply({ app, message, address: message.content });
      }
    } catch (e) {
      app.logger.error(e, 'onMessage error');
    }
  };

export type { KnownCommands, Message, OnMessageProps };
export { onMessage };
