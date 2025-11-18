import { LikeModel } from "../likes/likesMongoose";

export const getNewestLikesAggregation = async (postIds: string[]) => {
  return LikeModel.aggregate([
    // ШАГ 1: ФИЛЬТРАЦИЯ
    {
      $match: {
        parentId: { $in: postIds },
        parentType: "Post",
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
          //создаем массив
          $push: {
            likeId: "$_id",
            userId: "$userId",
            addedAt: "$createdAt",
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
  ]);
};
