import { Express } from "Express";
import { registerUser } from "../../auth/helpers/registerUser";
import {loginUser} from "../../auth/helpers/authUser";

export type UserData = {
  login: string;
  email: string;
  password: string;
  userAgent: string;
};
export async function getFourSessions(app: Express, userData: UserData) {
  const registration = await registerUser(app, {
    login: userData.login,
    email: userData.email,
    password: userData.password,
  });

  const firstUser = await loginUser(app, )
}
