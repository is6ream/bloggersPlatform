import { ObjectId } from "mongodb";

export type CreateUserDto = {
  passwordSalt: string;
  passwordHash: string;
  login: string;
  email: string;
  createdAt: Date;
};

export type UserDB = {
  _id: ObjectId;
  passwordSalt: string;
  passwordHash: string;
  login: string;
  email: string;
  createdAt: Date;
};
