export type CommentInfoType = {
  userId: string;
  userLogin: string;
};

export type CommentDB = {
  postId?: string;
  content: string;
  commentatorInfo: CommentInfoType;
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};

export type CommentInputType = {
  id: string;
  postId?: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};

export type ContentDto = {
  comment: string;
  userId: string;
  postId: string;
};

export type ContentType = string;
export type CommentInputDto = {
  content: string;
};

export type CommentQueryOutput = {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo?: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};

export type PostId = { id: string };
