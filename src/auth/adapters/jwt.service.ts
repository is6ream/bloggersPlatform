import { appConfig } from "./../../core/config/config";
import jwt from "jsonwebtoken";

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, appConfig.JWT_SECRET, {
      expiresIn: "1 h",
    });
  },
};
