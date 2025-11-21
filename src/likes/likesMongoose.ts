import { HydratedDocument, model, Model, Schema } from "mongoose";

export enum LikeStatus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

export type LikesDbType = {
  status: LikeStatus;
  userId: string;
  userLogin: string;
  parentId: string;
  parentType: string;
  createdAt: Date;
};
export type LikeModel = Model<LikesDbType>;
export type LikeDocument = HydratedDocument<LikesDbType>;

const likesSchema = new Schema<LikesDbType, LikeModel>({
  status: { type: String, enum: Object.values(LikeStatus), required: true },
  userId: { type: String, required: true },
  parentId: { type: String, required: true },
  parentType: { type: String, required: true },
  createdAt: { type: Date, default: () => Date.now(), required: true },
});

export const LikeModel = model<LikesDbType, LikeModel>(
  "likeModel",
  likesSchema,
);
