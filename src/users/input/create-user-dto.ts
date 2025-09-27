export type CreateUserDto = {
  passwordHash: string;
  login: string;
  email: string;
  createdAt: Date;
};

export type UserDB = {
  id?: string;
  passwordHash: string;
  login: string;
  email: string;
  createdAt: Date;
  emailConfirmation: {
    confirmationCode: string | null;
    expirationDate: Date | null;
    isConfirmed: boolean;
  };
};
