import express from "express";
import { setupApp } from "./setup-app";
import { appConfig } from "./core/config/config";
// import { db } from "./db/mongo.db";
import {db} from "./db/runDb";

const bootStrap = async () => {
  const app = express();
  app.set("trust proxy", true);
  setupApp(app);
  const PORT = process.env.PORT || 3000;
  await db.runDb();

  app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}`);
  });
  return app;
};
bootStrap();
