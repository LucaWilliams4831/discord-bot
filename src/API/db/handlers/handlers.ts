import type { DbInterface, Database } from '..';

enum UserStatus {
  IN_SNAPSHOT = 'IN_SNAPSHOT',
  NOT_IN_SNAPSHOT = 'NOT_IN_SNAPSHOT',
  APPLIED = 'APPLIED',
}

const checkUser =
  (db: DbInterface): Database['checkUser'] =>
  async (id: string): Promise<UserStatus> => {
    const userCanApply = await db.actions.checkUserInSnapshot(id);

    if (!userCanApply) return UserStatus.NOT_IN_SNAPSHOT;

    const applied = await db.actions.checkUserInApplied(id);

    if (applied) return UserStatus.APPLIED;

    return UserStatus.IN_SNAPSHOT;
  };

const addUser =
  (db: DbInterface): Database['addUser'] =>
  async (id, address) => {
    await db.actions.insertAppliedUser(id, address);
    const user = await db.actions.getUser(id);
    return user;
  };

const isReady =
  (db: DbInterface): Database['isReady'] =>
  async () =>
    db.actions.isReady();

export { checkUser, addUser, isReady, UserStatus };
