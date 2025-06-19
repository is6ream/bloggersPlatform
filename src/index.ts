import express from "express";
import { setupApp } from "./setup-app";
import { SETTINGS } from "./core/settings/settings";
import { runDB } from "./db/mongo.db";

const bootStrap = async () => {
  const app = express();
  setupApp(app);
  const PORT = process.env.PORT || 3000;
  await runDB(SETTINGS.MONGO_URL);

  app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}`);
  });
  return app;
};

bootStrap();
