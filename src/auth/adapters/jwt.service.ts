import { appConfig } from "../../core/config/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RefreshTokenPayload } from "../types/auth.types";

export const jwtService = {
  async createAccessToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, appConfig.JWT_SECRET, {
      expiresIn: "10 m",
    });
  },
  async createRefreshToken(userId: string, deviceId?: string): Promise<string> {
    return jwt.sign({ userId, deviceId }, appConfig.JWT_SECRET, {
      expiresIn: "20 m",
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

  async verifyToken(token: string): Promise<RefreshTokenPayload | null> {
    try {
      return jwt.verify(
        token,
        appConfig.JWT_SECRET,
      ) as unknown as RefreshTokenPayload;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async parseRefreshToken(token: string) {
    const decoded = jwt.decode(token) as JwtPayload | null;
    if (!decoded) return null;

    return {
      userId: decoded.userId as string,
      expiresAt: new Date((decoded.exp ?? 0) * 1000),
    };
  },
};
