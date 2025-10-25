import { Schema, Model, Document } from "mongoose";
import mongoose from "mongoose";
import { Blog } from "../blogs/types/blogs-types";
import { appConfig } from "../core/config/config";

export interface BlogDocument extends Blog, Document {
  _id: Schema.Types.ObjectId;
}

const BlogsSchema = new Schema<BlogDocument>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  isMembership: {
    type: Boolean,
    required: true,
  },
});

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
};
