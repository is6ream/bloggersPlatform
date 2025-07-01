import { CreateAuthDto } from "../handler/auth.userHandler";
import bcrypt from "bcrypt";

export const authService = {
  async create(loginOrEmail: string, password: string): Promise<void> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const dto: CreateAuthDto = {
      passwordHash,
      loginOrEmail,
    };

    return authRepository.create(dto);
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
};
