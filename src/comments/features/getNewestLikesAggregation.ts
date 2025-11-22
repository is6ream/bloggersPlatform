import { LikeModel } from "../../likes/likesMongoose";
export async function getNewestLikesAggregation(
  postIds: string[],
  userId: string,
) {
  return await LikeModel.aggregate([
    {
      $match: {
        parentId: { $in: postIds },
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
}
