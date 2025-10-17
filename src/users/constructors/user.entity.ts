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
    passRecoveryExpDate: Date | null;
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
      passRecoveryExpDate: null,
      isUsed: false,
    };
  }

  createRecoveryObject() {
    return {
      recoveryCode: randomUUID(),
      expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isUsed: false,
    };
  }
  //в бд объект с данными confirmation не является цельным объектом, потому что мы создаем его не с помощью класса, а берем извне

  useRecoveryCode(): void {
    this.passwordRecovery.isUsed = true;
  }
}
