import express from "express";
import cors from "cors";
import { blogsRouter } from "./blogs/blogs.routes";
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH } from "./core/paths";
import { Express } from "express";
import { postRouter } from "./posts/routes/routes";
import { testingRouter } from "./testing/posts.testing-router";
export const app = express();

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cors());
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postRouter);
  app.use(TESTING_PATH, testingRouter);

  app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
  });

  return app;
};

setupApp(app);
