import 'jest';
import { mockDeep } from 'jest-mock-extended';
import { id } from 'src/tests/helpers';
import { UserStatus } from 'src/API/db';
import { replyOnStatus, ReplyOnStatusProps, AnyDmProps, anyDm } from './anyDm';
import { messages } from './messages';

describe('Any DM', () => {
  describe('replyOnStatus', () => {
    it('should return APPLIED message', async () => {
      const msg = mockDeep<ReplyOnStatusProps>();
      replyOnStatus(msg, UserStatus.APPLIED);
      expect(msg.reply).toBeCalledWith(messages.applied);
    });
    it('should return NOT_IN_SNAPSHOT message', async () => {
      const msg = mockDeep<ReplyOnStatusProps>();
      replyOnStatus(msg, UserStatus.NOT_IN_SNAPSHOT);
      expect(msg.reply).toBeCalledWith(messages.notInSnapshot);
    });
    it('should return IN_SNAPSHOT message', async () => {
      const msg = mockDeep<ReplyOnStatusProps>();
      replyOnStatus(msg, UserStatus.IN_SNAPSHOT);
      expect(msg.reply).toBeCalledWith(messages.inSnapshot);
    });
  });
  describe('anyDm', () => {
    it('should be called properly', async () => {
      const props = mockDeep<AnyDmProps>();
      props.message.author.id = id;

      props.app.db.checkUser
        .calledWith(id)
        .mockReturnValue(Promise.resolve(UserStatus.NOT_IN_SNAPSHOT));

      await anyDm(props);

      expect(props.app.db.checkUser).toBeCalledWith(id);
      expect(props.message.reply).toBeCalledWith(messages.notInSnapshot);
    });
  });
});
