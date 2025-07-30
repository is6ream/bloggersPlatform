import { IdType } from "../../core/types/authorization/id";

export type CommentDBType = {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
};

export type CommentInputType = {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
};

export type ContentDto = {
  comment: string;
  userId: string;
  postId: string;
};

export type ContentType = string;
