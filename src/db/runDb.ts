import mongoose from "mongoose";
import { appConfig } from "../core/config/config";

export const db = {
  async runDb() {
    try {
      await mongoose.connect(appConfig.MONGO_URL);
      console.log("Connected successfully to mongoDB server");
    } catch (error) {
      console.log("Can't connect to mongo server", error);
      await mongoose.disconnect();
    }
  },

  async stopDb() {
    try {
      await mongoose.connection.close();
      console.log("Closing the mongoose connection");
    } catch (err) {
      console.error("Connection error", err);
    }
  },

  async dropDb() {
    await mongoose.connection.dropDatabase();
    console.log("Database dropped successfully");
  },
};
