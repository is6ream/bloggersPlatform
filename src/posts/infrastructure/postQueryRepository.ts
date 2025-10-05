import { PostDB, PostViewModel } from "./../types/posts-types";
import { postCollection } from "./../../db/mongo.db";
import { PostQueryInput } from "../input/post-query.input";
import { WithId, ObjectId } from "mongodb";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import {
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";

class PostQueryRepository {
  async findAll(
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<PostDB>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchPostNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchPostNameTerm) {
      filter["name"] = { $regex: searchPostNameTerm, $options: "i" };
    }
    const items = await postCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments(filter);

    return { items, totalCount }; //репо возвращает items и totalCount
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

    const items = await postCollection
      .find(filter) //тут изменил на findOne, изменил обратно, т.к нужен массив
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments(filter);

    return { items, totalCount };
  }

  async findById(id: string): Promise<Result<PostViewModel | null>> {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });

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
export const postQueryRepository = new PostQueryRepository();
