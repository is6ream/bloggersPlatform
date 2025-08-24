import { CreateUserDto, UserDB } from "../input/create-user-dto";
import { UserViewModel } from "../types/user-types";
import { userCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";
import { UserRegistrationDB } from "../../auth/types/auth.types";

export const usersRepository = {
  async create(newUser: CreateUserDto): Promise<UserViewModel> {
    const insertResult = await userCollection.insertOne(newUser);
    const insertId = insertResult.insertedId;

    return {
      id: insertId.toString(),
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  },

  async findUser(id: string): Promise<any> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    return user;
  },

  async delete(id: string): Promise<boolean> {
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },
  async isUserExistByEmailOrLogin(
    loginOrEmail: string
  ): Promise<WithId<UserDB> | null> {
    return userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  },

  async doesExistByLoginOrEmail(
    login: string,
    email: string
  ): Promise<boolean> {
    const user = await userCollection.findOne({
      $or: [{ email }, { login }],
    });
    return !!user;
  },

  async findUserByConfirmationCode(code: string): Promise<UserDB | null> {
    const user: UserDB | null = await userCollection.findOne({ code: code });
    return user;
  },
};
