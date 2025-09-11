import { UserInputModel } from "../../../src/users/types/user-types";
import { Express } from "express";
import request from "supertest";
import { USERS_PATH } from "../../../src/core/paths";
import { generateBasicAuthToken } from "../utils/secure/genBasicAuthToken";
import { HttpStatus } from "../../../src/core/http-statuses";
import { AUTH_PATH } from "../../../src/core/paths";

export function getUserCredentials(): UserInputModel {
  return {
    login: "1ur7HVXyxH",
    password: "string",
    email: "example@example.com",
  };
}

export const createUserAndAuth = async (app: Express) => {
  const { login, password, email } = getUserCredentials();
  await request(app)
    .post(USERS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send({ login: login, password: password, email: email })
    .expect(HttpStatus.Created);

  const loginUserRes = await request(app)
    .post(AUTH_PATH + "/login")
    .send({ loginOrEmail: login, password: password })
    .expect(HttpStatus.Ok);

  expect(loginUserRes.body.accessToken).toBeDefined();
  return loginUserRes.body.accessToken;
};
