export type AuthType = {
  id: string;
  loginOrEmail: string;
  passwordHash: string;
};

export type CreateUserDto = {
  login: string;
  password: string;
  email: string;
};
