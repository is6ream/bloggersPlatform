import { mongoose } from "mongoose";

export interface AggregationResult {
  _id: string; // ID поста (из parentId)
  postId: string; // дублирует _id для удобства
  newestLikes: LikeItem[];
}

export interface LikeItem {
  likeId: mongoose.Types.ObjectId;
  userId: string;
  addedAt: Date;
  status: string; // "Like" | "Dislike" | "None"
}
