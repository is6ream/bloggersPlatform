import express from "express";
import cors from "cors";
import { blogsRouter } from "./blogs/blogs.routes";
import {
  AUTH_PATH,
  BLOGS_PATH,
  COMMENTS_PATH,
  POSTS_PATH,
  SECURITY_DEVICES_PATH,
  TESTING_PATH,
  USERS_PATH,
} from "./core/paths";
import { Express } from "express";
import { postRouter } from "./posts/routes/postsRoutes";
import { testingRouter } from "./testing/deleteAllData.router";
import { authRouter } from "./auth/api/routes";
import { usersRouter } from "./users/routes/usersRoutes";
import { commentsRouter } from "./comments/routes/commentsRoutes";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import { securityDevicesRouter } from "./securityDevices/api/routes/secureDevicesRoutes";

dotenv.config();

const sessionSecret = process.env.SECRET_SESSION_KEY;
if (!sessionSecret) {
  throw new Error("No session Secret provided");
}
export const app = express();

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cors());
  app.use(
    session({
      secret: process.env.SECRET_SESSION_KEY as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: false,
      },
    }),
  );
  app.use(cookieParser());
  app.get("/", (req, res) => {
    res.status(200).send("Hello world!!!");
  });
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(AUTH_PATH, authRouter);
  app.use(USERS_PATH, usersRouter);
  app.use(COMMENTS_PATH, commentsRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(SECURITY_DEVICES_PATH, securityDevicesRouter);
  return app;
};

setupApp(app);
