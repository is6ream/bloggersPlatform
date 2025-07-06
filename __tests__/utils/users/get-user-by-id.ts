import request from "supertest";
import { Express } from "express";
import { USERS_PATH } from "../../../src/core/paths";
import { generateBasicAuthToken } from "../posts/generate-admin-auth-token";
import { UserViewModel } from "../../../src/users/types/user-types";
import { HttpStatus } from "../../../src/core/http-statuses";

export async function getUserById(
  app: Express,
  userId: string,
): Promise<UserViewModel> {
  const userResponse = await request(app)
    .get(`${USERS_PATH}/${userId}`)
    .set("Authorization", generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  return userResponse.body;
}
