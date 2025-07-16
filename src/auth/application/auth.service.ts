import bcrypt from "bcrypt";
import { CreateAuthDto } from "../types/input/login-input.model";
import { WithId } from "mongodb";
import { UserDBType } from "../../users/input/create-user-dto";
import { usersRepository } from "../../users/repositories/users.repository";
import { ResultStatus } from "../../common/result/resultCode";
import { Result } from "../../common/result/result.type";
import { bcryptService } from "../adapters/bcrypt.service";
import { HttpStatus } from "../../core/http-statuses";
export const authService = {
  async create(loginOrEmail: string, password: string): Promise<AuthResult> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const dto: CreateAuthDto = {
      passwordHash,
      loginOrEmail,
      createdAt: new Date(),
    };

    const authId = await authRepository.create(dto);
    const newAuth = await authQueryRepository.findById(authId);

    return newAuth!;
    //обратиться в репо, найти пользователя и проверить совпадает ли пароль
    //в 6 уроке есть пример дз
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<WithId<UserDBType> | null>> {
    const user = await usersRepository.isUserExistByEmail(loginOrEmail);
    if (!user) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "Not found",
        extensions: [{ field: "loginOrEmail", message: "Not found" }],
      };
    }
    const isPasscorrect = await bcryptService.checkPassword(
      password,
      user.passwordHash,
    );
    if (!isPasscorrect)
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: "Bad request",
        extensions: [{ field: "password", message: "wrong password" }],
      };

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  },
};
