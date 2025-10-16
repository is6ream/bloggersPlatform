import { UserDB } from "../input/create-user-dto";
import { UserDbDto, UserViewModel } from "../types/user-types";
import { recoveryCodeCollection, userCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";
import { User } from "../constructors/user.entity";
import { UserOutput } from "../types/user.output";
import { injectable } from "inversify";
import { RecoveryCodeTypeDB } from "../../auth/types/recoveryCodeType";

@injectable()
export class UsersRepository {
  async create(newUser: User): Promise<UserViewModel> {
    const insertResult = await userCollection.insertOne(newUser);
    const insertId = insertResult.insertedId;

    return {
      id: insertId.toString(),
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }

  async find(id: string): Promise<UserViewModel> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    return {
      id: user!._id.toString(),
      login: user!.login,
      email: user!.email,
      createdAt: user!.createdAt,
    };
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }

  async isUserExistByEmailOrLogin(
    loginOrEmail: string,
  ): Promise<UserOutput | null> {
    const user: WithId<User> | null = await userCollection.findOne({
      //
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    if (!user) {
      return null;
    }
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      passwordHash: user!.passwordHash,
      createdAt: user.createdAt,
      emailConfirmation: {
        confirmationCode: user.emailConfirmation.confirmationCode!,
        expirationDate: user.emailConfirmation.expirationDate!,
        isConfirmed: user.emailConfirmation.isConfirmed,
      },
    };
  }
  async doesExistByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<UserDB | undefined> {
    const existingByLogin = await userCollection.findOne({ login });
    if (existingByLogin) {
      return existingByLogin;
    }

    const existingByEmail = await userCollection.findOne({ email });
    if (existingByEmail) {
      return existingByEmail;
    }
  }

  async findUserByConfirmationCode(code: string): Promise<UserDbDto | null> {
    const user: WithId<User> | null = await userCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    if (!user) {
      return null;
    }

    if (
      !user.emailConfirmation?.confirmationCode || //если у объекта user нет confirmationCode или expirationDate
      !user.emailConfirmation?.expirationDate
    ) {
      return null;
    }
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      emailConfirmation: {
        confirmationCode: user.emailConfirmation.confirmationCode,
        expirationDate: user.emailConfirmation.expirationDate,
        isConfirmed: user.emailConfirmation.isConfirmed,
      }, //сделал валидацию на уровне метода
    };
  }

  async update(id: string): Promise<void> {
    const updateResult = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { "emailConfirmation.isConfirmed": true } },
    );
    console.log(updateResult, "updateResult check");
    return;
  }

  async resetPassword(newPassword: string): Promise<void> {
    const updateResult = await userCollection;
    return;
  }

  async saveConfirmationCode(
    confirmationDto: RecoveryCodeTypeDB,
  ): Promise<void> {
    await recoveryCodeCollection.insertOne(confirmationDto);
    return;
  }

  async findConfirmationCode(code: string): Promise<RecoveryCodeTypeDB | null> {
    return await recoveryCodeCollection.findOne({
      recoveryCode: code,
    });
  }
}
