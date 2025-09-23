import { Express } from "Express";
import { registerUser } from "../../auth/helpers/registerUser";
import { loginUser } from "../../auth/helpers/authUser";

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

  const firstUser = await loginUser(app);
}

export function getUserData(deviceName: string) {
  let userAgent: string = "";

  switch (deviceName) {
    case "iphone":
      userAgent = "iphone11";
      break;
    case "huawei D16":
      userAgent = "huawei D16";
      break;
    case "Macbook":
      userAgent = "Macbook";
      break;
    case "redmi 8":
      userAgent = "redmi 8";
      break;
  }

  return {
    login: "test",
    email: "test@mail.ru",
    password: "test",
    userAgent: userAgent,
  };
}
