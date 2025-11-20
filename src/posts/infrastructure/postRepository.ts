import { PostDB, PostViewModel } from "../types/posts-types";
import { ObjectId } from "mongodb";
import { WithId } from "mongodb";
import { injectable } from "inversify";
import { PostDocument, PostModel } from "../types/postMongoose";
import { LikeDocument, LikeModel } from "../../likes/likesMongoose";

@injectable()
export class PostsRepository {
  async create(post: PostDocument): Promise<string> {
    await post.save();
    return post._id.toString();
  }

  async save(post: PostDocument): Promise<void> {
    await post.save();
  }

  async findPost(id: string): Promise<WithId<PostDB> | null> {
    const post = await PostModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!post) {
      return null;
    }
    return {
      id: post._id.toString(),
      ...post,
    };
  }

  async findById(id: string, userId?: string): Promise<PostViewModel | null> {
    const post: WithId<PostDB> | null = await PostModel.findOne({
      _id: new ObjectId(id),
    }).lean();
    if (!post) {
      return null;
    }

    //2. Нам нужно получить реакции текущего пользователя на этот пост
    const userLikes = await LikeModel.find({
      userId: userId,
      postId: id,
      parentType: "Post",
    }).lean();

    console.log("user likes check", userLikes);
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
        newestLikes: {
          addedAt: post.extendedLikesInfo.newestLikesInfo.addedAt,
        },
      },
    };
  }

  async update(post: PostDocument): Promise<boolean> {
    await post.save();
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await PostModel.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }
  async likeStatusSave(like: LikeDocument): Promise<void> {
    await like.save();
    return;
  }
}
