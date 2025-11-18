import { NewestLikes, PostDB, PostViewModel } from "../types/posts-types";
import { PostQueryInput } from "../input/post-query.input";
import { WithId, ObjectId } from "mongodb";
import { Result } from "../../core/result/result.type";
import {
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";
import { injectable } from "inversify";
import { PostDocument, PostModel } from "../types/postMongoose";
import { mongoose } from "mongoose";
import { LikeModel, LikesDbType } from "../../comments/likes/likesMongoose";
import { getNewestLikesAggregation } from "../../comments/features/getNewestLikesAggregation";
import { UserModel } from "../../users/types/usersMongoose";
import { AggregationResult, LikeItem } from "../api/postQueryTypes";

@injectable()
export class PostsQueryRepository {
  async findAll(
    queryDto: PostQueryInput,
    userId?: string,
  ): Promise<{ items: PostViewModel[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchPostNameTerm } =
      queryDto;
    const skip = (pageNumber - 1) * pageSize;

    const posts: PostDocument[] = await PostModel.find({})
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const postsIds = posts.map((post) => post.id.toString());

    const likeForPosts = userId
      ? await LikeModel.find({
          parentId: { $in: postsIds },
          parentType: "Post",
          userId: userId,
        })
      : []; //как мы потом можем использовать этот пустой массив?

    const allLikes = (
      await LikeModel.find({
        postId: { $in: postsIds },
      }).sort({ createdAt: -1 })
    ).filter((like) => like.status === "Like");

  }

  async findPostsByBlogId(
    queryDto: PostQueryInput,
    blogId: string,
  ): Promise<{ items: WithId<PostDB>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchPostNameTerm } =
      queryDto;
    const skip = (pageNumber - 1) * pageSize;
    const filter: Record<string, any> = {
      blogId,
    };

    if (searchPostNameTerm) {
      filter.name = { $regex: searchPostNameTerm, $options: "i" };
    }

    const items = await PostModel.find(filter) //тут изменил на findOne, изменил обратно, т.к нужен массив
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .lean();

    const totalCount = await PostModel.countDocuments(filter);

    return { items, totalCount };
  }

  async findById(id: string): Promise<Result<PostViewModel | null>> {
    const post = await PostModel.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return handleNotFoundResult("post not found", "postId");
    }
    const data = {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
    return handleSuccessResult(data);
  }
}
