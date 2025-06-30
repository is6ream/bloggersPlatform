export const usersService = {
  async create(dto: any): Promise<string> {
    const { login, password, email } = dto;
    const passwordHash = await bcryptService.generateHash(password);

    const newUser = {
      login,
      email,
      passwordHash,
      createdAt: new Date()
    };

    const newUserId = await usersRepository.create(newUser);

    return newUserId;
  },
};
