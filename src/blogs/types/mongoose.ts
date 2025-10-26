import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { BlogDB } from "./blogs-types";

export type BlogModel = Model<BlogDB>;
export type BlogDocument = HydratedDocument<BlogDB>; //можно добавить статистические методы для сохранения пользователя

const blogsSchema = new mongoose.Schema<BlogDB, BlogModel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() }, //автоматически генерируем поле createdAt
  isMembership: { type: Boolean, default: false },
});

export const BlogModel = model<BlogDB, BlogModel>("blogModel", blogsSchema);
