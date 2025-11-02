import { LikeStatus } from "./likesMongoose";

export type LikeStatusRequest = {
  likeStatus: LikeStatus;
};

export type LikeStatusDto = {
  status: string;
  commentId: string;
  userId: string;
};
