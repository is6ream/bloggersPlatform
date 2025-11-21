import { LikeModel } from "../../likes/likesMongoose";

export const getNewestLikesAggregation = async (
  postIds: string[],
  userId: string,
) => {
  return LikeModel.aggregate([
    // ШАГ 1: ФИЛЬТРАЦИЯ
    {
      $match: {
        parentId: { $in: postIds },
        parentType: "Post",
      },
    },

    //ШАГ 2: lookup в коллекцию users для доступа к полю userLogin
    {
      $lookup: {
        from: "usermodels",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },

    // ШАГ 3: СОРТИРОВКА
    {
      $sort: { createdAt: -1 }, // новые лайки first
    },

    // ШАГ 4: ГРУППИРОВКА ПО ПОСТАМ
    {
      $group: {
        _id: "$parentId", //группируем по ID поста
        //Сохраняем все исходные документы лайков
        allReactions: { $push: "$$ROOT" },

        //Собираем статусы текущего пользователя
        userReaction: {
          $push: {
            $cond: [
              //аналог if
              { $eq: ["$userId", userId] }, //если это текущий пользователь,
              "$status", //ставим его статус
              "None", //по дефолту null //вот тут может быть null
            ],
          },
        },

        newestLikes: {
          $push: {
            $cond: [
              { $eq: ["$status", "Like"] }, //если это лайк
              {
                addedAt: "$createdAt",
                userId: "$userId",
                login: { $arrayElemAt: ["$user.login", 0] }, //первый элемент из массива lookup
              },
              null, // иначе null для дизлайков или null
            ],
          },
        },
      },
    },

    // ШАГ 5: ОГРАНИЧЕНИЕ КОЛИЧЕСТВА
    {
      $project: {
        postId: "$_id",

        //1. userReaction: первый не null статус
        userReaction: {
          $arrayElemAt: [
            //берем первый елемент
            {
              $filter: {
                input: "$userReaction",
                as: "reaction",
                cond: { $ne: ["$$reaction", "None"] }, //тут возможен затык из-за поля "None"
              },
            },
            0,
          ],
        },

        //2. newestLikes: срез 3 элементов
        newestLikes: {
          $slice: [
            {
              $filter: {
                input: "$newestLikes",
                as: "like",
                cond: { $ne: ["$$Like", null] },
              },
            },
            0, //начальный индекс
            3, //количество элементов
          ],
        },

        //3. likesCount: размер отфильтрованного массива
        likesCount: {
          $size: {
            $filter: {
              input: "$allReactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.status", "Like"] }, //берем только лайки
            },
          },
        },

        //4. dislikesCount: размер отфильтрованного массива
        dislikesCount: {
          $size: {
            $filter: {
              input: "allReactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.status", "Dislike"] }, //только дизлайки
            },
          },
        },
      },
    },
  ]);
};
