import bcrypt from "bcrypt";
import { CreateAuthDto } from "../types/input/login-input.model";
import { authRepository } from "../repositories/auth.repository";
import {
  authQueryRepository,
  AuthResult,
} from "../repositories/auth.query.repository";
export const authService = {
  async create(loginOrEmail: string, password: string): Promise<AuthResult> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const dto: CreateAuthDto = {
      passwordHash,
      loginOrEmail,
    };

    const authId = await authRepository.create(dto);
    const newAuth = await authQueryRepository.findById(authId);

    return newAuth!;
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
};
