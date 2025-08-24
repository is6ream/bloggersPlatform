export type AuthType = {
  id: string;
  loginOrEmail: string;
  passwordHash: string;
};

export type CreateUserDto = {
  login: string;
  password: string;
  email: string;
};

export type UserRegistrationDB = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
};
