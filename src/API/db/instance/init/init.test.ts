import 'jest';
import { mockDeep } from 'jest-mock-extended';
import { Pool, QueryResult } from 'pg';
import { Logger } from 'src/API/logger';
import { allUsers, allTables } from '../queries';
import { initTables, UserCount } from './init';

describe('Init', () => {
  describe('initTables', () => {
    it('should be properly called', async () => {
      const pool = mockDeep<Pool>();
      const logger = mockDeep<Logger>();
      const rows: QueryResult<UserCount>['rows'] = [{ users_count: '0', applied_users_count: '0' }];

      pool.query
        .calledWith(...([`${allUsers};`] as any))
        .mockReturnValue(Promise.resolve({ rows }) as any);

      await initTables(pool, logger);

      expect(pool.query).toHaveBeenCalledWith(`${allTables};`);
      expect(pool.query).toHaveBeenCalledWith(`${allUsers};`);
    });
  });
});
