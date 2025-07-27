import { appConfig } from "./../../core/config/config";
import jwt from "jsonwebtoken";

export const jwtService = {
    async createToken(userId: string): Promise<string>
}