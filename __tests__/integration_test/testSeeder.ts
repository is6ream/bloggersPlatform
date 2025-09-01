import { randomUUID } from "crypto";
import { add } from "date-fns";
import { db } from "../../src/db/mongo.db";
type RegisterUserPayloadType = {
  login: string;
  pass: string;
  email: string;
  code?: string;
  expirationDate?: Date;
  isConfirmed?: boolean;
};

export type RegisterUserResultType = {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
};

export const testSeeder = {
  createUserDto() {
    return {
      login: "testing",
      email: "test@mail.ru",
      pass: "12345678",
    };
  },

  createUserDtos(count: number) {
    const users = [{}];

    for (let i = 0; i < count; i++) {
      return users.push({
        login: "testing" + i,
        email: `test${i}@mail.ru`,
        pass: "12345678",
      });
    }
    return users;
  },

  async insertUser({
    login,
    pass,
    email,
    code,
    expirationDate,
    isConfirmed,
  }: RegisterUserPayloadType): Promise<RegisterUserResultType> {
    const newUser = {
      login,
      email,
      passwordHash: pass,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: code ?? randomUUID(),
        expirationDate:
          expirationDate ??
          add(new Date(), {
            minutes: 30,
          }),
        isConfirmed: isConfirmed ?? false,
      },
    };

    const res = await db.getCollections();
    const result = await res.userCollection.insertOne({ ...newUser });

    return {
      id: result.insertedId.toString(),
      ...newUser,
    };
  },
};
