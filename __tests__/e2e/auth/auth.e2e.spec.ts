import { testSeeder } from "./../../integration_test/testSeeder";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { db } from "../../../src/db/mongo.db";
import request from "supertest";
import { HttpStatus } from "../../../src/core/http-statuses";
describe("Auth API authorization flow check", () => {
  const app = express();
  setupApp(app);
  beforeAll(async () => {
    await db.runDB(
      "mongodb+srv://admin:admin@cluster0.x2itf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    );
    await db.drop();
  });

  afterAll(async () => {
    (await db.drop(), await db.stop());
  });

  it("should register user", async () => {
    const user = testSeeder.createUserDto();
    await request(app).post("/api/auth/registration").send(user);

    expect(HttpStatus.NoContent);
  });
});
