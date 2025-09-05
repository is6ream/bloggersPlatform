export type blackListedTokensDB = { //откуда мы должны взять эти данные? userId и expiresAt
  token: string;
  userId: string;
  expiresAt: Date;
};
