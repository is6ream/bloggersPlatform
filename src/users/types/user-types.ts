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

export type CurrentUser = {
  userId: string;
  login: string;
  email: string;
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

export type UserDB = {
    id?: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;

  emailConfirmation: {
    confirmationCode: string | null;
    expirationDate: Date | null;
    isConfirmed: boolean;
  };

  passwordRecovery?: {
    recoveryCode: string | null;
    passRecoveryExpDate: Date | null;
    isUsed: boolean /*этот флаг нужен для того,
      чтобы злоумышленник не смог использовать recovery code
      несколько раз **/;
  };
};
