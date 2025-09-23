import { Express } from "Express";
import { registerUser } from "../../auth/helpers/registerUser";
import { loginUser } from "../../auth/helpers/authUser";
import { getUserData } from "./getUserData";
import { UserAuthType } from "../types/userAuthType";
import { UserInputModel } from "../../../../src/users/types/user-types";

export async function getFourSessions(app: Express, userData: UserInputModel) {
  await registerUser(app, {
    //регистрируем пользователя
    login: userData.login,
    email: userData.email,
    password: userData.password,
  });

  const iphoneSessionData: UserAuthType = getUserData("iphone"); //создаем данные для авторизации и создания сессий для разных устройств
  const macSessionData: UserAuthType = getUserData("Macbook");
  const redmiSessionData: UserAuthType = getUserData("redmi 8");
  const huaweiSessionData: UserAuthType = getUserData("huawei D16");

  return {
    firstUser: await loginUser(app, iphoneSessionData), //авторизовываем разные устройства
    secondUser: await loginUser(app, macSessionData),
    thirdUser: await loginUser(app, redmiSessionData),
    fourthUser: await loginUser(app, huaweiSessionData),
  };
}
