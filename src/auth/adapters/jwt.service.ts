import { appConfig } from "./../../core/config/config";
import jwt from "jsonwebtoken";

export const jwtService = {
  async createAcessToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, appConfig.JWT_SECRET, {
      expiresIn: "10 s", //на 10-20 сек больше чем у accessToken
    });
  },
  async createRefreshToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, appConfig.JWT_SECRET, {
      expiresIn: "20 s", //на 10-20 сек больше чем у accessToken
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
