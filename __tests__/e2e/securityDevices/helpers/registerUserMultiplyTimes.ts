import { Express } from "express";
import { TestUserCredentials} from "../../users/createAndAuthUser";
import {registerUser} from "../../auth/helpers/registerUser";

export async function registerUserMultiplyTimes(
  app: Express,
  registrationDto: TestUserCredentials,
  times: number = 5,
): Promise<void> {
  for (let i = 0; i < times; i++) {
    try {
      await registerUser(app, registrationDto);
      console.log(`User registered  ${i + 1}/${times}`);
    } catch (e) {
      console.log(`Registration ${i + 1}failed `);
    }
  }
}
