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
  likesInfo: {
    likesCount: { type: Number, required: true, default: 0 },
    dislikesCount: { type: Number, required: true, default: 0 },
    myStatus: { type: String, required: true, default: "None" },
  },
});

export const PostModel = model<PostDB, PostModel>("posts", postSchema);
