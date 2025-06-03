import { app } from "./setup-app";
import express from "express";
import { setupApp } from "./setup-app";

const bootStrap = async () => {
  const app = express();
  setupApp(app);
  const PORT = process.env.PORT || 5001;
  await runDB();

  app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}`);
  });
  return app;
};

bootStrap();
