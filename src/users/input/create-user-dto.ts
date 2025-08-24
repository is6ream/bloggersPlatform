export type CreateUserDto = {
  passwordHash: string;
  login: string;
  email: string;
  createdAt: Date;
};

export type UserDB = {
  id?: string;
  passwordSalt: string;
  passwordHash: string;
  login: string;
  email: string;
  createdAt: Date;
};
