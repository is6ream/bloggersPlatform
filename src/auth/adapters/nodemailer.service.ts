import nodemailer from "nodemailer";
export const emailAdapter = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<boolean> {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "d.ilyasovunibell@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    //нужно понять как связать код подтверждения и пароль. В бд уже должен быть созданный пользователь?
    const info = transport.sendMail({
      from: '"Danil" <d.ilyasovunibell@gmail.com>',
      to: email,
      subject: "Your registration code is here",
      html: template(code),
    });
    return !!info;
  },
};
