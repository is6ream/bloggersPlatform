import { setupApp } from "./../../../src/setup-app";
import express from "express";
import { BlogAttributes } from "./types";
import { getBlogDto } from "../../utils/blogs/get-blog-dto";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";
import { runDB } from "../../../src/db/mongo.db";
import { clearDb } from "../../utils/posts/clear-db";

describe("Blog API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctTestBlogAttributes: BlogAttributes = getBlogDto();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(
      "mongodb+srv://admin:admin@firstcluster.atxbolf.mongodb.net/?retryWrites=true&w=majority&appName=FirstCluster"
    );
    await clearDb(app);
  });
});
