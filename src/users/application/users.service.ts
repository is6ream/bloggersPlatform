import { UserInputModel, UserViewModel } from "../types/user-types";

export const usersService = {
  async create(dto: UserInputModel): Promise<UserViewModel> {
    const { login, password, email } = dto;
    const passwordHash = await //тут вынести в папку core
  },
};
