import express from "express";
import cors from "cors";
import { videosRouter } from "./videos/routes";
import { VIDEOS_PATH } from "./core/paths";

export const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Hello world!");
});
app.use(VIDEOS_PATH, videosRouter);
