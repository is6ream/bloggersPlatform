import express from "express";
import cors from "cors";
import { blogsRouter } from "./blogs/routes/routes";
import {
  BLOGS_PATH,
  POSTS_PATH,
  TESTING_HW_PATH,
  TESTING_PATH,
} from "./core/paths";
import { Express } from "express";
import { postRouter } from "./posts/routes/routes";
// import { testingRouter } from "./testing/routers/testing.router";
export const app = express();

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
  });

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postRouter);
  // app.use(TESTING_PATH, testingRouter);
  app.use(TESTING_PATH, blogsRouter, postRouter);
  return app;
};

setupApp(app);
