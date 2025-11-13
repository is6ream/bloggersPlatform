import { PostDB, PostViewModel } from "../types/posts-types";
import { PostQueryInput } from "../input/post-query.input";
import { WithId, ObjectId } from "mongodb";
import { Result } from "../../core/result/result.type";
import {
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";
import { injectable } from "inversify";
import { PostModel } from "../types/postMongoose";
import { LikeModel } from "../../comments/likes/likesMongoose";
import { getNewestLikesAggregation } from "../../comments/features/getNewestLikesAggregation";

@injectable()
export class PostsQueryRepository {
  async findAll(
    queryDto: PostQueryInput,
    userId: string,
  ): Promise<{ items: WithId<PostDB>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchPostNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchPostNameTerm) {
      filter["name"] = { $regex: searchPostNameTerm, $options: "i" };
    }
    const posts = await PostModel.find(filter) //ищем посты
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .lean();

    const postIds = posts.map((post) => post._id.toString());
    console.log(postIds, "postIds check in Repo");
    const userLikes = LikeModel.find({ userId, postIds }); //для того,чтобы показать статус юзера
    const newestLikes = await getNewestLikesAggregation(postIds);
    console.log(newestLikes, "last 3 likes check");
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
    console.log(post);
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
