import { config } from "dotenv";

config();

export const appConfig = {
  PORT: process.env.PORT || 5001,
  MONGO_URL: "mongodb://127.0.0.1:27017/ed-back-lessons-platform",
  // process.env.MONGO_URL ||
  DB_NAME: process.env.DB_NAME || "ed-back-lessons-platform",
  JWT_SECRET: process.env.JWT_SECRET as string,
  AC_TIME: process.env.AC_TIME as string,
};
