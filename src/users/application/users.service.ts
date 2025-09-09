import bcrypt from "bcrypt";
import { UserInputModel, UserViewModel } from "../types/user-types";
import { CreateUserDto } from "../input/create-user-dto";
import { usersRepository } from "../repositories/users.repository";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { bcryptService } from "../../auth/adapters/bcrypt.service";

export const usersService = {
  async create(dto: UserInputModel): Promise<Result<string>> {
    const isEmailExist = await usersRepository.isUserExistByEmailOrLogin(
      dto.email,
    );
    if (isEmailExist) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "email is already exist",
        extensions: [{ field: null, message: "Email is already exist" }],
      };
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

  async delete(id: string): Promise<Result> {
    const result = await usersRepository.delete(id);
    if (!result) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "User not found",
        extensions: [{ field: null, message: "User not found " }],
      };
    } else {
      return {
        status: ResultStatus.Success,
        extensions: [],
      };
    }
  },

  async findUser(id: string): Promise<Result<UserViewModel>> {
    const user: UserViewModel = await usersRepository.find(id);

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  },
};
