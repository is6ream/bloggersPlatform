import bcrypt from "bcrypt";
import { UserInputModel, UserViewModel } from "../types/user-types";
import {  UserDB } from "../input/create-user-dto";
import { usersRepository } from "../repositories/users.repository";
import { Result } from "../../core/result/result.type";
import { bcryptService } from "../../auth/adapters/bcrypt.service";
import {
  handleBadRequestResult,
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";

export const usersService = {
  async create(dto: UserInputModel): Promise<Result<string>> {
    //используем этот метод при создании пользователя через createUser
    const isEmailExist = await usersRepository.isUserExistByEmailOrLogin(
      //проверяем, существует ли такой пользователь в бд
      dto.email,
    );
    console.log(isEmailExist, "check in BLL"); //здесь приходит null
    if (isEmailExist) {
      return handleBadRequestResult("Email already exists", "email");
    }
    const { login, password, email } = dto;
    const passwordHash = await bcryptService.generateHash(password);
    const user: UserDB = {
      login: login,
      email: email,
      passwordHash: passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: true,
      },
    };

    const newUser = await usersRepository.create(user);
    const newUserId = newUser.id;

    return handleSuccessResult(newUserId);
  },

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
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
