export interface UserCsvRow {
  Id: number;
  Author: string;
  Tokens: string;
}

export interface UserTransformedCsvRow {
  discord_id: string;
  number_in_list: number;
  tokens: string;
}

export interface UsersMergedRow {
  Id: number;
  AuthorName: string;
  Tokens: string;
  DiscordId: string;
  AuthorNameEncoded: string;
}
