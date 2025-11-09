import { CommentInputType } from "../types/commentsTypes";
import { CommentsListPaginatedOutput } from "../types/output/commentsListPaginatedOutput";
import { CommentViewModel } from "../types/commentsTypes";

export function mapToCommentListPaginatedOutput(
  comments: CommentInputType[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): CommentsListPaginatedOutput {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,

    items: comments.map(
      (comment): CommentViewModel => ({
        id: comment.id,
        content: comment.content,
        commentatorInfo: {
          userId: comment.commentatorInfo.userId,
          userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: comment.likesInfo.likesCount,
          dislikesCount: comment.likesInfo.dislikesCount,
          myStatus: comment.likesInfo.myStatus,
        },
      }),
    ),
  };
}
