import express from "express";
import cors from "cors";
import { videosRouter } from "./blogs/routes";
import { VIDEOS_PATH } from "./core/paths";
import { Express } from "express";
export const app = express();

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
  });
  app.use(VIDEOS_PATH, videosRouter);
  return app;
};
