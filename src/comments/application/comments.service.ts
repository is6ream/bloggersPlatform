import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { postRepository } from "../../posts/repositories/postRepository";
import { ContentDto } from "../types/commentsTypes";

export const commentsService = {
  async createComment(
    postId: string,
    dto: ContentDto
  ): Promise<Result<string>> {},
};
