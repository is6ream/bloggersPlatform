import { LikeStatus } from "./likesMongoose";

export type LikeStatusRequest = {
  likeStatus: LikeStatus;
};

export type LikeStatusDto = {
  status: LikeStatus;
  commentId: string;
  userId: string;
};
