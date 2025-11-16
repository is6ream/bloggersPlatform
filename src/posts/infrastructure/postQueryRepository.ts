import { newestLikes } from "./../types/posts-types";
import { newestLikes, PostDB, PostViewModel } from "../types/posts-types";
import { PostQueryInput } from "../input/post-query.input";
import { WithId, ObjectId } from "mongodb";
import { Result } from "../../core/result/result.type";
import {
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";
import { injectable } from "inversify";
import { PostModel } from "../types/postMongoose";
import {
  LikeDocument,
  LikeModel,
  LikesDbType,
} from "../../comments/likes/likesMongoose";
import { getNewestLikesAggregation } from "../../comments/features/getNewestLikesAggregation";
import { UserModel } from "../../users/types/usersMongoose";

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
    //1. Получаем посты
    const posts = await PostModel.find(filter) //ищем посты
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .lean();
    const postIds = posts.map((p) => p._id.toString()); //получаем id постов

    //2. Получаем реакции текущего пользователя на эти посты
    const userLikes = await LikeModel.find({
      userId: userId,
      parentId: { $in: postIds },
      parentType: "Post",
    }).lean(); //все лайки пользователя к полученным постам

    //3. Создаем карту статусов пользователя: postId : likeStatus
    const userStatusMap: Record<string, string> = {};
    userLikes.forEach((like) => {
      userStatusMap[like._id.toString()] = like.status;
    });

    //4. Получаем последние 3 лайка для каждого поста
    const last3LikesForEachPost = await getNewestLikesAggregation(postIds);

    //5. Получаем всех пользователей для маппинга userId : login
    const users = await UserModel.find({});
    const userLoginMap: Record<string, string> = {};
    users.forEach((user) => {
      userLoginMap[user._id.toString()] = user.login;
    });

    //6. Создаем карту newestLikes по postId
    const newestLikesMap: Record<string, newestLikes> = {};
    last3LikesForEachPost.forEach((item) => {
      const likesWithLogin: newestLikes = item.newestLikes.map(
        (like: LikesDbType) => {
          addedAt: like.createdAt;
          userId: like.userId;
          login: userLoginMap[like.userId] || "None";
        },
      );
      newestLikesMap[item.postId.toString()] = likesWithLogin;
    });

    //7. Формируем финальный ответ
    const items = posts.map((post) => {
      const postIdString = post._id.toString();
      console.log(newestLikesMap[postIdString], "newestLikesMap check");

      return {
        id: postIdString,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: post.likesInfo.likesCount,
          dislikesCount: post.likesInfo.dislikesCount,
          myStatus: userStatusMap[postIdString] || "None", //статус текущего пользователя
          newestLikes: newestLikesMap[postIdString] || [],
        },
      };
    });

    console.log(items, "items check");
    const totalCount = await PostModel.countDocuments(filter);

    return { items, totalCount };
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
