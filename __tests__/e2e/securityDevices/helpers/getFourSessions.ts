import { Express } from "Express";
import { loginUser } from "../../auth/helpers/authUser";
import { AuthCredentials } from "../../../../src/auth/types/input/login-input.models";
//ключевые моменты для понимания тестового flow
//Каждый логин с новым userAgent - новый deviceId в базе
//У каждого устройства свой refreshToken
//AccessToken обновляется, но deviceId остается таким же

//Будем тестировать изоляцию сессий - действия с одного устройства не должны влиять на другие
//Безопасность - можно управлять только своими сессиями
//lastActiveDate должен обновляется корректно
export async function getFourSessions(
  app: Express,
  authCredentials: AuthCredentials,
  deviceNames: string[],
) {
  const sessions = [];
  for (let i = 0; i < 4; i++) {
    const session = await loginUser(app, authCredentials, deviceNames[i]);
    sessions.push(session);
  }
  return sessions;
}


