import 'jest';
import { mockDeep } from 'jest-mock-extended';
import { onMessage, OnMessageProps, Message } from '.';

describe('Messages', () => {
  describe('onMessage', () => {
    it('should not run any command on message improper', async () => {
      const props = mockDeep<OnMessageProps>();
      const msg = mockDeep<Message>();
      msg.author.bot = true;

      await onMessage(props)(msg);

      expect(msg.reply).not.toBeCalled();
    });
  });
});
