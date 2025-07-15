export type CreateAuthDto = {
  loginOrEmail: string;
  passwordHash: string;
  createdAt: Date;
};
