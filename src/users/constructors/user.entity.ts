import { randomUUID } from "crypto";

export class User {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;

  emailConfirmation: {
    confirmationCode: string | null;
    expirationDate: Date | null;
    isConfirmed: boolean;
  };

  passwordRecovery: {
    recoveryCode: string | null;
    expirationDate: Date | null;
    isUsed: boolean /*этот флаг нужен для того,
      чтобы злоумышленник не смог использовать recovery code
      несколько раз **/;
  };

  constructor(login: string, email: string, hash: string) {
    this.login = login;
    this.email = email;
    this.passwordHash = hash;
    this.createdAt = new Date();

    this.emailConfirmation = {
      expirationDate: new Date(Date.now() + 3 * 60 * 1000),
      confirmationCode: randomUUID(),
      isConfirmed: false,
    };

    this.passwordRecovery = {
      recoveryCode: null,
      expirationDate: null,
      isUsed: false,
    };
  }
  useRecoveryCode(): void {
    this.passwordRecovery.isUsed = true;
  }
}
