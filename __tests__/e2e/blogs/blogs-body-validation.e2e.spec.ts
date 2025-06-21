import { setupApp } from "./../../../src/setup-app";
import express from "express";
import { BlogAttributes } from "./types";
import { getBlogDto } from "../../utils/blogs/get-blog-dto";
import { generateBasicAuthToken } from "../../utils/posts/generate-admin-auth-token";

describe("Blog API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctTestBlogAttributes: BlogAttributes = getBlogDto();

  const adminToken = generateBasicAuthToken();
});
