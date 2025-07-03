import { CreateUserDto } from "../input/create-user-dto";
import { UserViewModel } from "../types/user-types";
import { userCollection } from "../../db/mongo.db";

export const userRepository = {
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
};
