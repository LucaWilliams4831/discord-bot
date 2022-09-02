import 'jest';
import { mockDeep } from 'jest-mock-extended';
import { id } from 'src/tests/helpers';
import {
  properMessage,
  ProperMessageProps,
  getId,
  GetIdProps,
  isFirstMessage,
  firstMessageLimit,
  IsFirstMessageProps,
} from './helpers';

describe('Message helpers', () => {
  describe('properMessage', () => {
    it('should ignore bots', async () => {
      const msg: ProperMessageProps = { author: { bot: true }, channel: { type: 'DM' } };
      expect(properMessage(msg)).toEqual(false);
    });
    it('should only reply DM', async () => {
      const msg: ProperMessageProps = { author: { bot: false }, channel: { type: 'GUILD_TEXT' } };
      expect(properMessage(msg)).toEqual(false);
    });
    it('should fail if both wrong', async () => {
      const msg: ProperMessageProps = { author: { bot: true }, channel: { type: 'GUILD_TEXT' } };
      expect(properMessage(msg)).toEqual(false);
    });
    it('should not fail', async () => {
      const msg: ProperMessageProps = { author: { bot: false }, channel: { type: 'DM' } };
      expect(properMessage(msg)).toEqual(true);
    });
  });
  describe('getId', () => {
    it('should return id', async () => {
      const msg: GetIdProps = { author: { id } };

      expect(getId(msg)).toEqual(id);
    });
  });
  describe('isFirstMessage', () => {
    it('should return true when filtered size < 2', async () => {
      const msg = mockDeep<IsFirstMessageProps>();

      const promise = Promise.resolve({
        filter: () => ({
          size: 1,
        }),
      });

      msg.channel.messages.fetch.calledWith(firstMessageLimit).mockReturnValue(promise as any);

      const isFirst = await isFirstMessage(msg);

      expect(isFirst).toEqual(true);
    });
    it('should return false when filtered size >= 2', async () => {
      const msg = mockDeep<IsFirstMessageProps>();

      const promise = Promise.resolve({
        filter: () => ({
          size: 2,
        }),
      });

      msg.channel.messages.fetch.calledWith(firstMessageLimit).mockReturnValue(promise as any);

      const isFirst = await isFirstMessage(msg);

      expect(isFirst).toEqual(false);
    });
  });
});
