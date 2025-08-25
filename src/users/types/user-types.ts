export type UserInputModel = {
  login: string;
  password: string;
  email: string;
};

export type UserMappedViewModel = UserInputModel & {
  id: string;
};

export type UserType = UserInputModel;

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
};

export type UserDbDto = {
  id: string;
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
