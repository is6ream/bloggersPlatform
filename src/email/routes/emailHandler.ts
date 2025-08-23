import { Request, Response, Router } from "express";
import { emailAdapter } from "../../auth/adapters/nodemailer.service";

export type EmailType = {
  email: string;
  subject: string;
  message: string;
};
export type RequestWithEmail<E> = Request<{}, {}, E, {}>;

export async function emailHandler(
  req: RequestWithEmail<EmailType>,
  res: Response,
) {
  let message = await emailAdapter.sendEmail(
    req.body.email,
    req.body.subject,
    req.body.message,
  );

  res.status(200).send(message);
}
export const emailRouter = Router();

emailRouter.post("/send", emailHandler);
