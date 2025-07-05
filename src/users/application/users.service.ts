import bcrypt from "bcrypt";
import { UserInputModel } from "../types/user-types";
import { CreateUserDto } from "../input/create-user-dto";
import { userRepository } from "../repositories/users.repository";
export const usersService = {
  async create(dto: UserInputModel): Promise<string> {
    const { login, password, email } = dto;
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const user: CreateUserDto = {
      passwordHash,
      login,
      email,
      createdAt: new Date(),
    };

    const newUser = await userRepository.create(user);
    const newUserId = newUser.id;

    return newUserId;
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
};
