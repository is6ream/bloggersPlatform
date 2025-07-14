import { ObjectId } from "mongodb";

export type CreateUserDto = {
  passwordHash: string;
  login: string;
  email: string;
  createdAt: Date;
};

export type UserDBType = CreateUserDto & {
  _id: ObjectId;
  email: string;
  userName: string;
  passwordSalt: string;
};
