import 'jest';
import { ServerResponse } from 'http';
import { mockDeep } from 'jest-mock-extended';

import { InitServerProps, handleStatus, okResponseHeaders } from '.';

describe('Server', () => {
  describe('handleStatus', () => {
    it('should properly respond to user', async () => {
      const props = mockDeep<InitServerProps>();
      const response = mockDeep<ServerResponse>();

      const dbOk = true;
      const botOk = true;

      props.app.db.isReady.calledWith().mockReturnValue(Promise.resolve(dbOk));
      props.client.isReady.calledWith().mockReturnValue(botOk);

      await handleStatus(props as any)(response);

      expect(response.writeHead).toBeCalledWith(200, okResponseHeaders);
      expect(response.end).toBeCalledWith(JSON.stringify({ dbOk, botOk }));
    });
  });
});
