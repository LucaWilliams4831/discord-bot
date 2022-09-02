import 'jest';
import { mockDeep } from 'jest-mock-extended';
import { id, wrongAddress, address, addUserResponse } from 'src/tests/helpers';
import { UserStatus } from 'src/API/db';
import { apply, ApplyProps } from './apply';
import { messages as anyDmMessages } from '../anyDm/messages';
import { messages } from './messages';

describe('Apply', () => {
  it('should give hello message if user cant apply', async () => {
    const props = mockDeep<ApplyProps>();
    props.message.author.id = id;

    props.app.db.checkUser.calledWith(id).mockReturnValue(Promise.resolve(UserStatus.APPLIED));

    await apply(props);

    expect(props.app.db.checkUser).toBeCalledWith(id);
    expect(props.message.reply).toBeCalledWith(anyDmMessages.applied);
  });
  it('should give error message on wrong address', async () => {
    const props = mockDeep<ApplyProps>();
    props.message.author.id = id;
    props.address = wrongAddress;

    props.app.db.checkUser.calledWith(id).mockReturnValue(Promise.resolve(UserStatus.IN_SNAPSHOT));

    await apply(props);

    expect(props.app.db.checkUser).toBeCalledWith(id);
    expect(props.message.reply).toBeCalledWith(messages.wrongAddress);
  });
  it('should work if everything ok', async () => {
    const props = mockDeep<ApplyProps>();
    props.message.author.id = id;
    props.address = address;

    props.app.db.checkUser.calledWith(id).mockReturnValue(Promise.resolve(UserStatus.IN_SNAPSHOT));

    props.app.db.addUser.calledWith(id, address).mockReturnValue(Promise.resolve(addUserResponse));

    await apply(props);

    expect(props.app.db.checkUser).toBeCalledWith(id);
    expect(props.app.db.addUser).toBeCalledWith(id, address);
    expect(props.message.reply).toBeCalledWith(messages.success(addUserResponse.tokens));
  });
});
