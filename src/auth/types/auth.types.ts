export type AuthType = {
  id: string;
  loginOrEmail: string;
  passwordHash: string;
};

export type AuthDBType = {
  loginOrEmail: string;
  passwordHash: string;
};
