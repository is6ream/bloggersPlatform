import { NewestLikes } from "./../types/posts-types";
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
import {
  LikeDocument,
  LikeModel,
  LikesDbType,
} from "../../likes/likesMongoose";

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

    // 1. Создаем основной пайплайн агрегации
    const aggregationPipeline: any[] = [];

    // Фильтрация постов
    if (searchPostNameTerm) {
      aggregationPipeline.push({
        $match: {
          title: { $regex: searchPostNameTerm, $options: "i" },
        },
      });
    }

    // 2. Получаем общее количество ДО пагинации
    const totalCountPipeline = [...aggregationPipeline, { $count: "total" }]; //
    const totalCountResult = await PostModel.aggregate(totalCountPipeline);
    const totalCount = totalCountResult[0]?.total || 0;

    // 3. Продолжаем основной пайплайн
    aggregationPipeline.push(
      { $sort: { [sortBy]: sortDirection === "asc" ? 1 : -1 } },
      { $skip: skip },
      { $limit: +pageSize },
    );

    // 4. Соединение с лайками для newestLikes (только Like статус)
    aggregationPipeline.push({
      $lookup: {
        from: "likemodels",
        let: { postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$parentId", "$$postId"] },
                  { $eq: ["$parentType", "Post"] },
                  { $eq: ["$status", "Like"] },
                ],
              },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 3 },
          {
            $lookup: {
              from: "users", // предполагаем, что есть коллекция пользователей
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $project: {
              _id: 0,
              addedAt: "$createdAt",
              userId: 1,
              login: { $arrayElemAt: ["$user.login", 0] }, // получаем логин из коллекции пользователей
            },
          },
        ],
        as: "newestLikes",
      },
    });

    // 5. Соединение для получения статуса текущего пользователя
    if (userId) {
      aggregationPipeline.push({
        $lookup: {
          from: "likemodels",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$parentId", "$$postId"] },
                    { $eq: ["$parentType", "Post"] },
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
          ],
          as: "myLike",
        },
      });
    }

    // 6. Выполняем агрегацию
    const posts = await PostModel.aggregate(aggregationPipeline);

    // 7. Преобразуем в нужный формат
    const items: PostViewModel[] = posts.map((post) => {
      // Определяем myStatus
      let myStatus = "None";
      if (userId && post.myLike && post.myLike.length > 0) {
        myStatus = post.myLike[0].status;
      }

      return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: post.likesInfo?.likesCount || 0,
          dislikesCount: post.likesInfo?.dislikesCount || 0,
          myStatus: myStatus,
          newestLikes: post.newestLikes || [],
        },
      };
    });

    return {
      items,
      totalCount,
    };
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
