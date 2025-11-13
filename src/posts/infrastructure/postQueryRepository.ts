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
import { UserModel } from "../../users/types/usersMongoose";

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

    const postIds = posts.map((post) => post._id) as unknown as ObjectId[];
    const userLikes = LikeModel.find({ userId, postIds }); //для того,чтобы показать статус юзера
    const getNewestLikesAggregation = async (postIds: ObjectId[]) => {
      const result = await LikeModel.aggregate([
        // ШАГ 1: ФИЛЬТРАЦИЯ
        {
          $match: {
            parentId: { $in: postIds },
            parentType: "Post",
            // status: "Like" // если хотите только лайки, а не дизлайки
          },
        },

        // ШАГ 2: СОРТИРОВКА
        {
          $sort: { createdAt: -1 }, // новые лайки first
        },

        // ШАГ 3: ГРУППИРОВКА ПО ПОСТАМ
        {
          $group: {
            _id: "$parentId", // группируем по parentId (это id поста)
            allLikes: {
              $push: {
                likeId: "$_id",
                userId: "$userId",
                createdAt: "$createdAt",
                status: "$status",
              },
            },
          },
        },

        // ШАГ 4: ОГРАНИЧЕНИЕ КОЛИЧЕСТВА
        {
          $project: {
            postId: "$_id",
            newestLikes: {
              $slice: ["$allLikes", 3], // берем только первые 3 элемента
            },
          },
        },

        // ШАГ 5: "РАЗВОРАЧИВАЕМ" ДЛЯ РАБОТЫ С КАЖДЫМ ЛАЙКОМ
        {
          $unwind: "$newestLikes",
        },

        // ШАГ 6: Получаем данные пользователя
        {
          $lookup: {
            from: "usersModel",
            localField: "newestLikes.userdId",
            foreignField: "_id",
            as: "userData",
          },
        },

        // ШАГ 7: Преобразуем массив пользователей в объект
        {
          $unwind: {
            path: "userData",
            preserveNullAndEmptyArrays: true,
          },
        },

        //ШАГ 8: Формируем нужную структуру
        {
          $project: {
            _id: 0,
            postId: 1,
            addedAt: "$newestLikes.createdAt",
            userId: "$newestLikes.userId",
            login: "$userData.login",
          },
        },

        //ШАГ 9: Снова группируем по постам
        {
          $group: {
            _id: "$postId",
            newestLikes: {
              $push: {
                addedAt: "$addedAt",
                userId: "$userId",
                login: "$login",
              },
            },
          },
        },

        //ШАГ 10: Финальная стурктура
        {
          $project: {
            _id: 0,
            postId: "$_id",
            newestLikes: 1,
          },
        },
      ]);
      return result;
    };

    const postsModels = await getNewestLikesAggregation(postIds);
    console.log(postsModels, "posts check id queryRepo");

    // const items = await Promise.all(
    //   //функция для формирования PostViewModel с расширенной информацией о лайках
    //   posts.map(async (post) => {
    //     const userLike = await LikeModel.findOne({
    //       //данная переменная нужна для п
    //       postId: post._id,
    //       userId: userId,
    //     });
    //     const newestLikes = await LikeModel.find({ postId: post._id })
    //       .sort({ createdAt: -1 })
    //       .limit(3);
    //
    //     return {
    //       id: post._id.toString(),
    //       title: post.title,
    //       shortDescription: post.shortDescription,
    //       content: post.content,
    //       blogId: post.blogId,
    //       blogName: post.blogName,
    //       createdAt: post.createdAt,
    //       extendedLikesInfo: {
    //         likesCount: post.likesInfo.likesCount,
    //         dislikesCount: post.likesInfo.dislikesCount,
    //         myStatus: userLike?.status || "None",
    //         newestLikes: newestLikes,
    //       },
    //     };
    //   }),
    // );
    // const totalCount = await PostModel.countDocuments(filter);
    //
    // return { items, totalCount };
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
