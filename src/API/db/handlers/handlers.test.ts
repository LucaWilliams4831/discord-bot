import 'jest';
import { mockDeep } from 'jest-mock-extended';
import { id, address, addUserResponse } from 'src/tests/helpers';
import { DbInterface, UserStatus } from '..';
import { checkUser, addUser, isReady } from './handlers';

describe('DB public handlers', () => {
  describe('checkUser', () => {
    it('should return not in snapshot', async () => {
      const db = mockDeep<DbInterface>();

      db.actions.checkUserInSnapshot.calledWith(id).mockReturnValue(Promise.resolve(false));

      const status = await checkUser(db)(id);

      expect(status).toEqual(UserStatus.NOT_IN_SNAPSHOT);
    });
    it('should return applied', async () => {
      const db = mockDeep<DbInterface>();

      db.actions.checkUserInSnapshot.calledWith(id).mockReturnValue(Promise.resolve(true));
      db.actions.checkUserInApplied.calledWith(id).mockReturnValue(Promise.resolve(true));

      const status = await checkUser(db)(id);

      expect(status).toEqual(UserStatus.APPLIED);
    });
    it('should return in snapshot', async () => {
      const db = mockDeep<DbInterface>();

      db.actions.checkUserInSnapshot.calledWith(id).mockReturnValue(Promise.resolve(true));
      db.actions.checkUserInApplied.calledWith(id).mockReturnValue(Promise.resolve(false));

      const status = await checkUser(db)(id);

      expect(status).toEqual(UserStatus.IN_SNAPSHOT);
    });
  });
  describe('addUser', () => {
    it('should add and return user', async () => {
      const db = mockDeep<DbInterface>();

      db.actions.insertAppliedUser.calledWith(id, address).mockReturnValue(Promise.resolve());
      db.actions.getUser.calledWith(id).mockReturnValue(Promise.resolve(addUserResponse));

      const user = await addUser(db)(id, address);

      expect(user.discord_id).toEqual(addUserResponse.discord_id);
    });
  });
  describe('isReady', () => {
    it('should return status', async () => {
      const db = mockDeep<DbInterface>();

      db.actions.isReady.calledWith().mockReturnValue(Promise.resolve(true));

      const ready = await isReady(db)();

      expect(ready).toEqual(true);
    });
  });
});
