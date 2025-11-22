import { NewestLikes } from './../types/posts-types';
import { PostViewModel } from "../types/posts-types";
import { PostQueryInput } from "../input/post-query.input";
import { injectable } from "inversify";
import { PostModel } from "../types/postMongoose";
import { getNewestLikesAggregation } from "../../comments/features/getNewestLikesAggregation";
import { LikeModel } from "../../likes/likesMongoose";
import { ObjectId } from "mongodb";

export type NewestLikesType = {
  addedAt: Date;
  userId: string;
  login: string;
};

@injectable()
export class PostsQueryRepository {
  async findAll(
    queryDto: PostQueryInput,
    userId?: string
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

    const likes = await LikeModel.find({});

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
      {} as Record<string, any>
    );
    const items: PostViewModel[] = posts.map((post) => {
      /*здесь мы обращаемся к тем постам, которые изначально получили по id и пребразуем их в нужный формат данных**/
      const postId = post._id.toString();

      const postLikes = likesMap[postId] || {
        //на каждой итерации достаем сущность лайка и передаем данные из нее на в queryController
        userReaction: "None",
        newestLikes: [],
        likesCount: 0,
        dislikesCount: 0,
      };

      console.log(postLikes.newestLikes, "newestLikes check"); //поля userLogin здесь нет

      return {
        id: postId,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: postLikes.likesCount,
          dislikesCount: postLikes.dislikesCount,
          myStatus: userId ? postLikes.userReaction : "None",
          newestLikes: postLikes.newestLikes,
        },
      };
    });

    const totalCount = await PostModel.countDocuments({});
    return { items: items, totalCount: totalCount };
  }

  async findById(
    postId: string,
    userId: string,
  ): Promise<PostViewModel | null> {
    const post = await PostModel.findOne({ _id: new ObjectId(postId) }).lean();
    if (!post) {
      return null;
    }

    const newestLikes = await LikeModel.aggregate([
    {
      $match: {
        parentId: postId,
        parentType: "Post",
      },
    },
    {
      $lookup: {
        from: "usermodels",
        let: { userIdString: "$userId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$userIdString" }],
              },
            },
          },
        ],
        as: "user",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: "$parentId",
        allReactions: { $push: "$$ROOT" },
        userReaction: {
          $push: {
            $cond: [{ $eq: ["$userId", userId] }, "$status", null],
          },
        },
        newestLikes: {
          $push: {
            $cond: [
              { $eq: ["$status", "Like"] },
              {
                addedAt: "$createdAt",
                userId: "$userId",
                login: { $arrayElemAt: ["$user.login", 0] },
              },
              null,
            ],
          },
        },
      },
    },
    {
      $project: {
        postId: "$_id",
        userReaction: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$userReaction",
                as: "reaction",
                cond: { $ne: ["$$reaction", null] },
              },
            },
            0,
          ],
        },
        newestLikes: {
          $slice: [
            {
              $filter: {
                input: "$newestLikes",
                as: "like",
                cond: { $ne: ["$$like", null] },
              },
            },
            0,
            3,
          ],
        },
        likesCount: {
          $size: {
            $filter: {
              input: "$allReactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.status", "Like"] },
            },
          },
        },
        dislikesCount: {
          $size: {
            $filter: {
              input: "$allReactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.status", "Dislike"] },
            },
          },
        },
      },
    },
  ]);

  console.log(newestLikes, "nl check")

  return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.likesInfo.likesCount,
        dislikesCount: post.likesInfo.dislikesCount,
        myStatus: post.likesInfo.myStatus,
        newestLikes: 
      }
    }
  }

}

//тут нужно сделать запрос к лайкам по полю parentId и передать туда postId

    