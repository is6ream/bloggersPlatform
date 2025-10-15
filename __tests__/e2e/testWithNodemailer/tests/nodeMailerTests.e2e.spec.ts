import { describe } from "node:test";
import express from "express";
import { setupApp } from "../../../../src/setup-app";

describe("test with Nodemailer", () => {
  const expressApp: Express = express();
  const app: Express = setupApp(expressApp);
});
