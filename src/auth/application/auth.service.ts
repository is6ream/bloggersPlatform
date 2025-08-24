import { WithId } from "mongodb";
import { UserDB } from "../../users/input/create-user-dto";
import { usersRepository } from "../../users/repositories/users.repository";
import { ResultStatus } from "../../core/result/resultCode";
import { Result } from "../../core/result/result.type";
import { bcryptService } from "../adapters/bcrypt.service";
import { jwtService } from "../adapters/jwt.service";
import { User } from "../../users/constructors/user.entity";

export const authService = {
  async registerUser(
    login: string,
    password: string,
    email: string
  ): Promise<Result<User | null>> {
    const user = await usersRepository.doesExistByLoginOrEmail(login, email);
    if (user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad request",
        extensions: [{ field: "user", message: "user already registered" }],
        data: null,
      };
    }
    
    const passwordHash = await bcryptService.generateHash(password);

    const newUser = new User(login, email, passwordHash);
    await usersRepository.create(newUser);
  },

  async loginUser(
    loginOrEmail: string,
    password: string
  ): Promise<Result<{ accessToken: string } | null>> {
    const result = await this.checkUserCredentials(loginOrEmail, password);
    if (result.status !== ResultStatus.Success)
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Unauthorized",
        extensions: [{ message: "Wrong credentials", field: "loginOrEmail" }],
        data: null,
      };
    const accessToken = await jwtService.createToken(
      result.data!._id.toString()
    );
    return {
      status: ResultStatus.Success,
      data: { accessToken },
      extensions: [],
    };
  },

  async checkUserCredentials(
    loginOrEmail: string,
    password: string
  ): Promise<Result<WithId<UserDB> | null>> {
    const user = await usersRepository.isUserExistByEmailOrLogin(loginOrEmail);
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
      user.passwordHash
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
