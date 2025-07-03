import bcrypt from "bcrypt";
import { UserInputModel, UserViewModel } from "../types/user-types";
import { CreateUserDto } from "../input/create-user-dto";

export const usersService = {
  async create(dto: UserInputModel): Promise<UserViewModel> {
    const { login, password, email } = dto;
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const user: CreateUserDto = {
      passwordHash,
      login,
      email,
    };

    const userId = await userRepository.create(user);
    const newUser = await userQueryRepository.findById(userId);

    return newUser;
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
};
