import express from "express";
import { setupApp } from "./setup-app";
import { appConfig } from "./core/config/config";
import { db } from "./db/mongo.db";
const bootStrap = async () => {
  const app = express();
  setupApp(app);
  const PORT = process.env.PORT || 3000;
  await db.runDB(appConfig.MONGO_URL);

  app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}`);
  });
  return app;
};

bootStrap();
