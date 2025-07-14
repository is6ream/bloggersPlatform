import { CreateUserDto } from "../input/create-user-dto";
import { UserViewModel } from "../types/user-types";
import { userCollection } from "../../db/mongo.db";
import { ObjectId } from "mongodb";

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

  async isUserExistByEmail(email: string): Promise<boolean> {
    const user = await userCollection.findOne({ email });
    return !!user;
  },

  async delete(id: string): Promise<void | null> {
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      return null;
    }
  },
};
