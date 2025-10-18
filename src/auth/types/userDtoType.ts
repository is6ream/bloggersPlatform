export type UserDto = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  emailConfirmation: {
    confirmationCode: null;
    expirationDate: null;
    isConfirmed: boolean;
  };
};
