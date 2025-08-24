import { randomUUID } from "crypto";
import add from "date-fns/add";

export const authService = {
  async registerUser(
    login: string,
    pass: string,
    email: string,
  ): Promise<IUserDB | null> {
    const user = await usersRepository.doesExistByLoginOrEmail(login, email);
    if (user) return null;
    //проверить существует ли уже юзер с таким логином или почтой и если да - не регистрировать

    const passwordHash = await bcryptService.generateHash(pass); //создать хэш пароля

    const newUser: IUserDB = {
      // сформировать dto юзера
      login,
      email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        // доп поля необходимые для подтверждения
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
    };
    await usersRepository.create(newUser); // сохранить юзера в базе данных

    //отправку сообщения лучше обернуть в try-catch, чтобы при ошибке(например отвалиться отправка) приложение не падало
    try {
      await nodemailerService.sendEmail(
        //отправить сообщение на почту юзера с кодом подтверждения
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailExamples.registrationEmail,
      );
    } catch (e: unknown) {
      console.error("Send email error", e); //залогировать ошибку при отправке сообщения
    }
    return newUser;
  },
};
