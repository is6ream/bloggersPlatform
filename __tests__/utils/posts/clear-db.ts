//@ts-ignore
import request from "supertest";
import { Express } from "express";
import { TESTING_PATH } from "../../../src/core/paths";
import { HttpStatus } from "../../../src/core/http-statuses";
export async function clearDb(app: Express) {
  await request(app)
    .delete(`${TESTING_PATH}/all-data`)
    .expect(HttpStatus.NoContent);
  return;
}
