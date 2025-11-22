import { NewestLikes } from "./../types/posts-types";
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
import { getNewestLikesAggregation } from "../../comments/features/getNewestLikesAggregation";

export type NewestLikesType = {
  addedAt: Date;
  userId: string;
  login: string;
};

@injectable()
export class PostsQueryRepository {
  async findAll(
    queryDto: PostQueryInput,
    userId?: string,
  ): Promise<{ items: PostViewModel[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchPostNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchPostNameTerm) {
      filter["name"] = { $regex: searchPostNameTerm, $options: "i" };
    }

    //1. Получить посты с пагинацией
    const posts = await PostModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();
    //2. Если есть вернуть, нет -> пустой объект
    if (!posts) {
      return { items: [], totalCount: 0 };
    }
    //3. Собрать id постов
    const postIds = posts.map((post) => post._id.toString()); //собираем id постов

    //4. Агрегация лайков, получаем статус текущего пользователя, 3 последних лайка, счетчики
    const aggregationResult = await getNewestLikesAggregation(postIds, userId!); //агрегационная функция работает
    console.log(aggregationResult, "aggregationResult check");

    //5. Перобразуем в объект-карту для доступа к полям по postId

    const likesMap = aggregationResult.reduce(
      (acc, item) => {
        acc[item.postId] = {
          userReaction: item.userReaction || "None",
          newestLikes: item.newestLikes,
          likesCount: item.likesCount,
          dislikesCount: item.dislikesCount,
        };
        return acc;
      },
      {} as Record<string, any>,
    );

    console.log(likesMap, "likesMap check")
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
