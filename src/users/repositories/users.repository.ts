import { CreateUserDto, UserDBType } from "../input/create-user-dto";
import { UserViewModel } from "../types/user-types";
import { userCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";

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

  async isUserExistByEmailOrLogin(
    loginOrEmail: string,
  ): Promise<WithId<UserDBType> | null> {
    return userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  },

  async delete(id: string): Promise<boolean> {
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },
};
