import { ObjectId } from "mongodb";
import { authColletction } from "../../db/mongo.db";

export type AuthResult = {
  id: string;
  loginOrEmail: string;
  password: string;
};

export const authQueryRepository = {
  async findById(id: string): Promise<AuthResult | null> {
    const auth = await authColletction.findOne({ _id: new ObjectId(id) });

    if (!auth) {
      return null;
    }
    return {
      id: auth._id.toString(),
      loginOrEmail: auth.loginOrEmail,
      password: auth.passwordHash,
    };
  },
};
