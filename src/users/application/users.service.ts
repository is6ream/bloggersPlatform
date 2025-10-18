import { UserInputModel, UserViewModel } from "../types/user-types";
import { UsersRepository } from "../infrastructure/users.repository";
import { Result } from "../../core/result/result.type";
import { bcryptService } from "../../auth/adapters/bcrypt.service";
import {
  handleBadRequestResult,
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";
import { injectable, inject } from "inversify";
import { User } from "../constructors/user.entity";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
  ) {}
  async create(dto: UserInputModel): Promise<Result<string>> {
    const isEmailExist = await this.usersRepository.isUserExistByEmailOrLogin(
      dto.email,
    );
    if (isEmailExist) {
      return handleBadRequestResult("Email already exists", "email");
    }
    const { login, password, email } = dto;
    const passwordHash = await bcryptService.generateHash(password);
    const user = new User(login, email, passwordHash);
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
