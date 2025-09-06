import { testSeeder } from "../../../integration_test/testSeeder";
import request from "supertest";
import { HttpStatus } from "../../../../src/core/http-statuses";
import { Express } from "express";
import { AUTH_PATH } from "../../../../src/core/paths";

// export const registerUser = async (app: Express) => {
//   const credentials = testSeeder.createUserDto();
//   await request(app)
//     .post(AUTH_PATH + "/registration")
//     .send(credentials)
//     .expect(HttpStatus.NoContent);
// };
export const getRefreshToken = async (app: Express) => {
  const { login, password } = testSeeder.createUserDto();
  const credentials = { loginOrEmail: login, password: password };
  const refreshToken = await request(app)
    .post(AUTH_PATH + "/login")
    .send(credentials)
    .expect(HttpStatus.Ok);

  return refreshToken;
};
