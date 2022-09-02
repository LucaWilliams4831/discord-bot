import 'jest';
import { QueryResult } from 'pg';
import { mockDeep } from 'jest-mock-extended';
import { id, address, addUserResponse } from 'src/tests/helpers';
import { queries } from '../queries';
import type { DbInstance } from '..';
import {
  Exists,
  User,
  checkUserInSnapshot,
  checkUserInApplied,
  getUser,
  insertAppliedUser,
  isReady,
} from './actions';

describe('Actions', () => {
  describe('checkUserInSnapshot', () => {
    it('should return exists status', async () => {
      const instance = mockDeep<DbInstance>();
      const rows: QueryResult<Exists>['rows'] = [{ exists: true }];

      instance.pool.query
        .calledWith(...([`${queries.checkExistenceInUsers};`] as any))
        .mockReturnValue(Promise.resolve({ rows }) as any);

      const exists = await checkUserInSnapshot(instance)(id);

      expect(exists).toEqual(true);
    });
  });
  describe('checkUserInApplied', () => {
    it('should return exists status', async () => {
      const instance = mockDeep<DbInstance>();
      const rows: QueryResult<Exists>['rows'] = [{ exists: true }];

      instance.pool.query
        .calledWith(...([`${queries.checkExistenceInAppliedUsers};`] as any))
        .mockReturnValue(Promise.resolve({ rows }) as any);

      const exists = await checkUserInApplied(instance)(id);

      expect(exists).toEqual(true);
    });
  });
  describe('getUser', () => {
    it('should return user', async () => {
      const instance = mockDeep<DbInstance>();
      const rows: QueryResult<User>['rows'] = [addUserResponse];

      instance.pool.query
        .calledWith(...([`${queries.getUser};`] as any))
        .mockReturnValue(Promise.resolve({ rows }) as any);

      const user = await getUser(instance)(id);

      expect(user).toEqual(addUserResponse);
    });
  });
  describe('insertAppliedUser', () => {
    it('should be called properly', async () => {
      const instance = mockDeep<DbInstance>();

      instance.pool.query.calledWith(...([`${queries.insertToAppliedUsers};`] as any));

      await insertAppliedUser(instance)(id, address);

      expect(instance.pool.query).toBeCalledTimes(1);
    });
  });
  describe('isReady', () => {
    it('should report if ready', async () => {
      const instance = mockDeep<DbInstance>();
      const rows: QueryResult<Exists>['rows'] = [{ exists: false }];

      instance.pool.query
        .calledWith(...([`${queries.userTableExists};`] as any))
        .mockReturnValue(Promise.resolve({ rows }) as any);

      const exists = await isReady(instance)();

      expect(exists).toEqual(false);
    });
  });
});
