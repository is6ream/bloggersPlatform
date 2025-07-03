export type CreateUserDto = {
  passwordHash: string;
  login: string;
  email: string;
  createdAt: Date;
};

export type UserDBType = CreateUserDto;
