export interface CreateUserInpuDto {
  login: string;
  password: string;
  email: string;
}

export interface IUserDB {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export const usersService = {
  async create(dto: CreateUserInpuDto): Promise<string> {
    const { login, email, password } = dto;
    const passwordHash = await bcryptService.generateHash(password);

    const newUser: IUserDB = {
      login,
      email,
      passwordHash,
      createdAt: new Date(),
    };
    const newUserId = await usersRepository.create(newUser);
    return newUserId;
  },
};
