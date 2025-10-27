import { PostDB } from "./posts-types";
import { HydratedDocument, Model, Schema, model } from "mongoose";

export type PostModel = Model<PostDB>;
export type PostDocument = HydratedDocument<PostDB>;

const postSchema = new Schema<PostDB, PostModel>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const PostModel = model<PostDB, PostModel>("posts", postSchema);
