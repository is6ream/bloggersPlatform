import { LikeStatus } from "./likesMongoose";

export type LikeStatusRequest = {
  likeStatus: LikeStatus;
};

export type CommentLikeStatusDto = {
  status: LikeStatus;
  commentId: string;
  userId: string;
};

export type PostLikeStatusDto = {
  status: LikeStatus;
  postId: string;
  userId: string;
};
