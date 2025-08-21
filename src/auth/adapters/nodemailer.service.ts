import nodemailer from "nodemailer";
import { Request, Response, Router } from "express";

export const emailRouter = Router();

emailRouter.post("/send", async (req: Request, res: Response) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465,
      secure: true, // TLS
      auth: {
        user: "testnodemailer12@mail.ru", // твоя почта
        pass: "KCKW7EgvI0XFc2zionaN", // пароль приложения из Mail.ru
      },
    });

    const info = await transport.sendMail({
      from: '"Danil" <testnodemailer12@mail.ru>', // отправитель
      to: req.body.email, // получатель
      subject: req.body.subject, // тема
      html: req.body.message, // HTML тело
    });

    res.send({
      email: req.body.email,
      message: req.body.message,
      subject: req.body.subject,
    });

    console.log("Message sent:", info.messageId);
  } catch (e) {
    console.error("Send mail error:", e);
    res.status(500).send({ error: "Failed to send email" });
  }
});
