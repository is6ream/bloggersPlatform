export type CommentDBType = {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
};

export type CommentInputType = {
  postId: string;
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

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
};
