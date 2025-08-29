export const testSeeder = {
  createUserDto() {
    return {
      login: "testing",
      email: "test@gmail.com",
      pass: "12345678",
    };
  },
  createUserDtos(count: number) {
    const users = [];

    for (let i = 0; i <= count; i++) {
      users.push({
        login: "test" + i,
        email: `test${i}@gmail.com`,
        pass: "12345678",
      });
    }
    return users;
  },
  async insertUser({ login, pass, email, code, expirationDate, isConfirmed }) {
    const newUser = {
      login,
      email,
      passwordHash: pass,
      createdAt: new Date(),
      emailConfirmation: {
         confirmationCode: code ?? randomUUID(),
                expirationDate: expirationDate ?? add(new Date(), {
                    minutes: 30,
      },
    };
  },
}
}
