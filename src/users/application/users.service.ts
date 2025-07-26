import bcrypt from "bcrypt";
import { UserInputModel } from "../types/user-types";
import { CreateUserDto } from "../input/create-user-dto";
import { usersRepository } from "../repositories/users.repository";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";

interface IEmailError {
  field: string;
  message: string;
}

class EmailError extends Error implements IEmailError {
  public field: string; //десктриптор
  constructor(message: string, field = "") {
    super(message);
    this.field = field;
    this.message = message;
  }
} //правила жесткие

export const usersService = {
  async create(dto: UserInputModel): Promise<Result<string>> {
    const isEmailExist = await usersRepository.isUserExistByEmail(dto.email);
    if (isEmailExist) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "email is already exist",
        extensions: [{ field: null, message: "Email is already exist" }],
      };
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

    return {
      status: ResultStatus.Success,
      data: newUserId,
      extensions: [],
    };
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },

  async delete(id: string): Promise<any> {
    return usersRepository.delete(id);
  },
};
