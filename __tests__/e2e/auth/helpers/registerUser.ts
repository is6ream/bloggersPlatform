import request from "supertest";
import { Express } from "express";
import { UserInputModel } from "../../../../src/users/types/user-types";
import { AUTH_PATH } from "../../../../src/core/paths";
import { HttpStatus } from "../../../../src/core/http-statuses";
import { TestUserCredentials } from "../../users/createAndAuthUser";

export async function registerUser(
  app: Express,
  registrationDto: TestUserCredentials,
) {
  const userDto: UserInputModel = {
    login: registrationDto.login,
    password: registrationDto.password,
    email: registrationDto.email,
  };

  await request(app)
    .post(`${AUTH_PATH}/registration`)
    .send(userDto)
    .expect(HttpStatus.NoContent);
  return;
}
