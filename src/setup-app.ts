import express from "express";
import cors from "cors";
import { blogsRouter } from "./blogs/routes";
import { BLOGS_PATH } from "./core/paths";
import { Express } from "express";
export const app = express();

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
  });

  app.use(BLOGS_PATH, blogsRouter);
  return app;
};

setupApp(app);
