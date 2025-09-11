import { UserInputModel } from "../../../src/users/types/user-types";
import { Express } from "express";
import request from "supertest";
import { USERS_PATH } from "../../../src/core/paths";
import { generateBasicAuthToken } from "../utils/secure/genBasicAuthToken";
import { HttpStatus } from "../../../src/core/http-statuses";

export function getUserCredentials(): UserInputModel {
  return {
    login: "newLogin",
    password: "123456",
    email: "example@mail.ru",
  };
}

export const createUser = async (app: Express) => {
  const userDto = getUserCredentials();

  const createUser = await request(app)
    .post(USERS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(userDto)
    .expect(HttpStatus.Created);
};
