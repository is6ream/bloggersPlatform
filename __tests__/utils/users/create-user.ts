import { USERS_PATH } from "../../../src/core/paths";
import { UserInputModel } from "../../../src/users/types/user-types";
import request from "supertest";
import { Express } from "express";
import { generateBasicAuthToken } from "../posts/generate-admin-auth-token";
import { getUserDto } from "./get-user-dto";
import { UserViewModel } from "../../../src/users/types/user-types";
import { HttpStatus } from "../../../src/core/http-statuses";
export async function createUser(
  app: Express,
  userDto: UserInputModel,
): Promise<UserViewModel> {
  const defaultUserData: UserInputModel = getUserDto();

  const testUserData = { ...defaultUserData, ...userDto };

  const createdUserResponse = await request(app)
    .post(USERS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testUserData)
    .expect(HttpStatus.Created);

  return createdUserResponse.body;
}
