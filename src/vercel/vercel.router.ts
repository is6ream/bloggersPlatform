import { Request, Response } from "express";
import { app } from "../setup-app";

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello world!");
});
