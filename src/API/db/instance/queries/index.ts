enum Tables {
  USERS = 'users',
  USERS_APPLIED = 'users_applied',
}

enum UserTable {
  ID = 'discord_id',
  LIST_NUMBER = 'number_in_list',
  TOKENS = 'tokens',
}

enum AppliedUserTable {
  ID = 'discord_id',
  ADDRESS = 'address',
  CREATED_AT = 'created_at',
}

const queries = {
  usersTable: `
    CREATE TABLE IF NOT EXISTS ${Tables.USERS} (
        ${UserTable.ID} TEXT NOT NULL PRIMARY KEY,
        ${UserTable.LIST_NUMBER} INTEGER NOT NULL,
        ${UserTable.TOKENS} MONEY NOT NULL
    )`,
  appliedUsersTable: `
    CREATE TABLE IF NOT EXISTS ${Tables.USERS_APPLIED} (
        ${AppliedUserTable.ID} TEXT NOT NULL PRIMARY KEY REFERENCES ${Tables.USERS} (${UserTable.ID}) ON UPDATE CASCADE,
        ${AppliedUserTable.ADDRESS} TEXT NOT NULL,
        ${AppliedUserTable.CREATED_AT} TIMESTAMP DEFAULT NOW()
    )`,

  userTableExists: `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = '${Tables.USERS}'
  )`,

  countUsers: `SELECT count(*) FROM ${Tables.USERS}`,
  countAppliedUsers: `SELECT count(*) FROM ${Tables.USERS_APPLIED}`,

  insertToUsers: `INSERT INTO ${Tables.USERS} 
      (${UserTable.ID}, ${UserTable.LIST_NUMBER}, ${UserTable.TOKENS}) 
      VALUES($1, $2, $3)`,
  insertToAppliedUsers: `INSERT INTO ${Tables.USERS_APPLIED} 
      (${AppliedUserTable.ID}, ${AppliedUserTable.ADDRESS}) 
      VALUES($1, $2)`,

  getUser: `SELECT ${UserTable.ID}, ${UserTable.LIST_NUMBER}, ${UserTable.TOKENS}::numeric::int FROM ${Tables.USERS} WHERE ${UserTable.ID}=$1`,
  updateUser: `UPDATE ${Tables.USERS} SET ${UserTable.ID} = $2 WHERE ${UserTable.ID}=$1 RETURNING *;`,

  checkExistenceInUsers: `
    SELECT EXISTS (
        SELECT 1 FROM ${Tables.USERS} WHERE ${UserTable.ID}=$1
    )`,
  checkExistenceInAppliedUsers: `
    SELECT EXISTS (
        SELECT 1 FROM ${Tables.USERS_APPLIED} WHERE ${AppliedUserTable.ID}=$1
    )`,
} as const;

const allUsers = `SELECT (${queries.countUsers}) AS users_count, (${queries.countAppliedUsers}) AS applied_users_count`;
const allTables = `${queries.usersTable}; ${queries.appliedUsersTable}`;

export { queries, allUsers, allTables, Tables, UserTable, AppliedUserTable };
