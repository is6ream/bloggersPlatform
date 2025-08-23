import nodemailer from "nodemailer";

export const emailAdapter = {
  async sendEmail(email: string, subject: string, message: string) {
    try {
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
        subject: subject,
        html: message,
      });

      return info;
    } catch (e) {
      console.error("Send mail error:", e);
    }
  },
};
