import { setupApp } from "./../src/setup-app";
import request from "supertest";
import { HttpStatus } from "../src/core/types";
import { BLOGS_PATH, TESTING_PATH } from "../src/core/paths";
import express from "express";

interface BlogInputDto {
  name: string;
  description: string;
  websiteUrl: string;
}

describe("Blog API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctTestBlogData: BlogInputDto = {
    name: "dan",
    description: "guy from Ufa",
    websiteUrl: "https://github.com/is6ream/bloggersPlatform",
  };

  beforeAll(async () => {
    await request(app)
      .delete(`${TESTING_PATH}/all-data`)
      .expect(HttpStatus.NoContent);
  });

  it("should get all blogs", async () => {
    const res = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);
  });

  it("should not create blog with incorrect body passed and check authorization", async () => {
    const validCredentials = Buffer.from("admin:qwerty").toString("base64"); //прописал данные для авторизации
    const invalidDataset1 = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", `Basic ${validCredentials}`)
      .send({
        ...correctTestBlogData,
        name: "    ",
        description: "   ",
        websiteUrl: "  ",
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataset1.body.errorMessages).toHaveLength(4);
  });

  it("should not create blog with correct body passed and unsuccess authorization", async () => {
    const inValidCredentials = Buffer.from("admin:werty").toString("base64");
    const invalidDataset1 = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", `Basic ${inValidCredentials}`)
      .send({
        ...correctTestBlogData,
        name: "dan",
        description: "dan",
        websiteUrl: "https://www.deepseek.com/",
      })
      .expect(HttpStatus.Unauthorized);
  });

  it("should not update blog with incorrect body passed", async () => {
    const validCredentials = Buffer.from("admin:qwerty").toString("base64");
    const invalidaDataset2 = await request(app)
      .put(`${BLOGS_PATH}/123`)
      .set("Authorization", `Basic ${validCredentials}`)
      .send({
        ...correctTestBlogData,
        name: "   ",
        description: "   ",
        websiteUrl: "  ",
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidaDataset2.body.errorMessages).toHaveLength(4);
  });

  it("should update blog with correct body passed", async () => {
    const validCredentials = Buffer.from("admin:qwerty").toString("base64");
    const validDataset = await request(app)
      .put(`${BLOGS_PATH}/123`)
      .set("Authorization", `Basic ${validCredentials}`)
      .send({
        ...correctTestBlogData,
        name: "ssss",
        description: "sss",
        websiteUrl: "https://www.deepseek.com/",
      })
      .expect(HttpStatus.NoContent);
    expect(validDataset.body.errorsMessages).toHaveLength(0);

    //тут почему-то падает 500 ошибка
  });
});
