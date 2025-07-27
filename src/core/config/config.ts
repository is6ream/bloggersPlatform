import { config } from "dotenv";
config();

export const appConfig = {
  PORT: process.env.PORT || 5001,
  MONGO_URL:
    process.env.MONGO_URL ||
    "mongodb+srv://admin:admin@cluster0.nm5nplv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  DB_NAME: process.env.DB_NAME || "ed-back-lessons-platform",
  JWT_SECRET: process.env.JWT_SECRET as string,
};
