import nodemailer from "nodemailer";

export const emailAdapter = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string
  ): Promise<boolean> {
    const transport = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465,
      secure: true, // TLS
      auth: {
        user: "testnodemailer12@mail.ru",
        pass: "KCKW7EgvI0XFc2zionaN",
      },
    });

    const info = await transport.sendMail({
      from: '"Danil" <testnodemailer12@mail.ru>',
      to: email,
      subject: "Your registration code is here!",
      html: template(code),
    });

    return !!info;
  },
};
