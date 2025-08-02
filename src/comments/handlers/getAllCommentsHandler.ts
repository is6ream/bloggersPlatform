import { CommentViewModel } from './../types/commentsTypes';
import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { CommentsQueryInput } from "../types/input/comment-Query-Input";
import { setDefaultPaginationIfNotExist } from "../../core/helpers/set-default-sort-and-pagination";
import { WithId } from "mongodb";


export type CommentsListPaginatedOutput = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentViewModel[]
}
export function mapToCommentListPaginatedOutput(
    comments: WithId<CommentViewModel>[],
    meta: {pageNumber: number; pageSize: number; totalCount: number},
): CommentsListPaginatedOutput {
    return {
          pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,

    items: comments.map(
        (comment): CommentViewModel => ({
id: comment._id.toString(),
content: comment.content,
commentatorInfo: {
    userId: comment.commentatorInfo.userId,
    userLogin: comment.commentatorInfo.userLogin
},
createdAt: comment.createdAt
        })
    )
    }
}




export async function getAllCommentsHandler(
  req: Request<{}, {}, {}, CommentsQueryInput>,
  res: Response
) {
    try {
        const queryInput = setDefaultPaginationIfNotExist(req.query);

        const {items, totalCount} = map
    }
}
