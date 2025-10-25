import { Schema, Model, Document } from "mongoose";
import mongoose from "mongoose";
import { BlogDB } from "../blogs/types/blogs-types";
import { appConfig } from "../core/config/config";
import { Types } from "mongoose";

export interface BlogDocument extends Document {
  //описал то, что будет храниться в базе данных
  _id: Types.ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
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
  websiteUrl: {
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

export const BlogModel = mongoose.model<BlogDocument>("blogs", BlogsSchema);

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
