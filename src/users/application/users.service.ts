import bcrypt from "bcrypt";
import { UserInputModel } from "../types/user-types";
import { CreateUserDto } from "../input/create-user-dto";
import { usersRepository } from "../repositories/users.repository";

interface IEmailError {
  field: string;
  message: string;
}

class EmailError extends Error implements IEmailError {
  public field: string; //десктриптор
  constructor(message: string, field = "") {
    super(message);
    this.field = field;
  }
} //правила жесткие

export const usersService = {
  async create(dto: UserInputModel): Promise<string> {
    const isEmailExist = await usersRepository.isUserExistByEmail(dto.email);
    if (isEmailExist) {
      throw new EmailError("Email is already exist", "email");
    }
    const { login, password, email } = dto;
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const user: CreateUserDto = {
      passwordHash,
      login,
      email,
      createdAt: new Date(),
      passwordSalt,
    };

    const newUser = await usersRepository.create(user);
    const newUserId = newUser.id;

    return newUserId;
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },

  async delete(id: string): Promise<void | undefined> {
    await usersRepository.delete(id);
    return;
  },
};
