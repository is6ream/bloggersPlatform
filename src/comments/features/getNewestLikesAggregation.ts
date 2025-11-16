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

    // // ШАГ 5: "РАЗВОРАЧИВАЕМ" ДЛЯ РАБОТЫ С КАЖДЫМ ЛАЙКОМ
    // {
    //   $unwind: "$newestLikes",
    // },
    //
    // // ШАГ 6: Получаем данные пользователя
    // {
    //   $lookup: {
    //     from: "usermodels",
    //     localField: "newestLikes.userdId",
    //     foreignField: "_id",
    //     as: "userData",
    //   },
    // },
    //
    // // ШАГ 7: Преобразуем массив пользователей в объект
    // {
    //   $unwind: {
    //     path: "$userData",
    //     preserveNullAndEmptyArrays: true,
    //   },
    // },
    //
    // //ШАГ 8: Формируем нужную структуру
    // {
    //   $project: {
    //     _id: 0,
    //     postId: 1,
    //     addedAt: "$newestLikes.createdAt",
    //     userId: "$newestLikes.userId",
    //     login: "$userData.login",
    //   },
    // },
    //
    // //ШАГ 9: Снова группируем по постам
    // {
    //   $group: {
    //     _id: "$postId",
    //     newestLikes: {
    //       $push: {
    //         addedAt: "$addedAt",
    //         userId: "$userId",
    //         login: "$login",
    //       },
    //     },
    //   },
    // },
    //
    // //ШАГ 10: Финальная стурктура
    // {
    //   $project: {
    //     _id: 0,
    //     postId: "$_id",
    //     newestLikes: 1,
    //   },
    // },
  ]);
};
