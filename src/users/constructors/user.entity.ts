import { randomUUID } from "crypto";

// export class User {
//   login: string;
//   email: string;
//   passwordHash: string;
//   createdAt: Date;
//   emailConfirmation: {
//     confirmationCode: string | null; //поправить типы
//     expirationDate: Date | null;
//     isConfirmed: boolean;
//   };
//
//   constructor(login: string, email: string, hash: string) {
//     ((this.login = login),
//       (this.email = email),
//       (this.passwordHash = hash),
//       (this.createdAt = new Date()),
//       (this.emailConfirmation = {
//         expirationDate: new Date(Date.now() + 3 * 60 * 1000),
//         confirmationCode: randomUUID(),
//         isConfirmed: false,
//       }));
//   }
// }

export class User {
  constructor(
    public login: string,
    public email: string,
    public passwordHash: string,
    public createdAt: Date,
    public emailConfirmation: {
      confirmationCode: string | null;
      expirationDate: Date | null;
      isConfirmed: boolean;
    },
  ) {
    this.createdAt = new Date();
    this.emailConfirmation = {
      expirationDate: new Date(Date.now() + 3 * 60 * 1000),
      confirmationCode: randomUUID(),
      isConfirmed: false,
    };
  }
}
