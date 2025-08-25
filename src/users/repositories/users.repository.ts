import { CreateUserDto, UserDB } from "../input/create-user-dto";
import { UserDbDto, UserViewModel } from "../types/user-types";
import { userCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";
import { User } from "../constructors/user.entity";

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
    loginOrEmail: string,
  ): Promise<WithId<UserDB> | null> {
    return userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  },

  async doesExistByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<boolean> {
    const user = await userCollection.findOne({
      $or: [{ email }, { login }],
    });
    return !!user;
  },

  async findUserByConfirmationCode(code: string): Promise<UserDbDto | null> {
    const user: WithId<User> | null = await userCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      emailConfirmation: user.emailConfirmation,
    };
  },

  async update(id: string): Promise<void> {
    await userCollection.updateOne(
      { id: new ObjectId(id) },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );
    return;
  },
};
