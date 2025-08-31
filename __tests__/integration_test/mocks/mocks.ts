import { emailAdapter } from "../../../src/auth/adapters/nodemailer.service";

export const emailServiceMock: emailAdapter = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<boolean> {
    return true;
  },
};
