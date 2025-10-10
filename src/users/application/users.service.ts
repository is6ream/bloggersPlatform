import { UserInputModel, UserViewModel } from "../types/user-types";
import { UsersRepository } from "../infrastructure/users.repository";
import { Result } from "../../core/result/result.type";
import { bcryptService } from "../../auth/adapters/bcrypt.service";
import {
  handleBadRequestResult,
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";
import { User } from "../constructors/user.entity";

export class UsersService {
  constructor(private usersRepository: UsersRepository) {}
  async create(dto: UserInputModel): Promise<Result<string>> {
    //используем этот метод при создании пользователя через createUser
    const isEmailExist = await this.usersRepository.isUserExistByEmailOrLogin(
      //проверяем, существует ли такой пользователь в бд
      dto.email,
    );
    if (isEmailExist) {
      return handleBadRequestResult("Email already exists", "email");
    }
    const { login, password, email } = dto;
    const passwordHash = await bcryptService.generateHash(password);
    const user: User = {
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

    const newUser = await this.usersRepository.create(user);
    const newUserId = newUser.id;
    return handleSuccessResult(newUserId);
  }
  async delete(id: string): Promise<Result> {
    const result = await this.usersRepository.delete(id);
    if (!result) {
      return handleNotFoundResult("user not found", "userId");
    } else {
      return handleSuccessResult();
    }
  }
  async findUser(id: string): Promise<Result<UserViewModel>> {
    const user: UserViewModel = await this.usersRepository.find(id);

    return handleSuccessResult(user);
  }
}
