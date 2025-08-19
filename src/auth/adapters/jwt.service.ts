import { appConfig } from "./../../core/config/config";
import jwt from "jsonwebtoken";

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, appConfig.JWT_SECRET, {
      expiresIn: "1 h",
    });
  },

  async decodeToken(token: string): Promise<any> {
    try {
      return jwt.decode(token);
    } catch (err: unknown) {
      console.error("Can't decode token ", err);
      return null;
    }
  },

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, appConfig.JWT_SECRET) as { userId: string };
    } catch (error) {
      console.log(error);
      console.error("Token verify some error");
      return null;
    }
  },
};
