import { createAuthDto } from "../handler/loginUserHandler";

export const authService = {
  async create(dto: createAuthDto): Promise<void> {
    authRepository.create(dto);
    return;
  },
};
