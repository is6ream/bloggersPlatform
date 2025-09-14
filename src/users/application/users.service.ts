import bcrypt from "bcrypt";
import { UserInputModel, UserViewModel } from "../types/user-types";
import { CreateUserDto } from "../input/create-user-dto";
import { usersRepository } from "../repositories/users.repository";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { bcryptService } from "../../auth/adapters/bcrypt.service";
import {
  handleBadRequestResult,
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";

export const usersService = {
  async create(dto: UserInputModel): Promise<Result<string>> {
    const isEmailExist = await usersRepository.isUserExistByEmailOrLogin(
      dto.email,
    );
    console.log(isEmailExist, "check in BLL");
    if (isEmailExist) {
      return handleBadRequestResult("Email already exists", "email");
    }
    const { login, password, email } = dto;
    const passwordHash = await bcryptService.generateHash(password);

    const user: CreateUserDto = {
      passwordHash,
      login,
      email,
      createdAt: new Date(),
    };

    const newUser = await usersRepository.create(user);
    const newUserId = newUser.id;

    return handleSuccessResult(newUserId);
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },

  async delete(id: string): Promise<Result> {
    const result = await usersRepository.delete(id);
    if (!result) {
      return handleNotFoundResult("user not found", "userId");
    } else {
      return handleSuccessResult();
    }
  },

  async findUser(id: string): Promise<Result<UserViewModel>> {
    const user: UserViewModel = await usersRepository.find(id);

    return handleSuccessResult(user);
  },
};
