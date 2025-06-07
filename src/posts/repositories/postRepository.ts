import { PostType } from "../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/mongo.db";

export const postRepository = {
  async findAll(): Promise<PostType[]> {
    const posts = await postCollection.find().toArray();
    return posts.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      blogId: p.blogId,
      blogName: p.blogName,
      createdAt: p.createdAt,
    }));
  },

  async findById(id: string): Promise<PostType | null> {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },

  async create(newPost: PostType): Promise<WithId<PostType>> {
    const insertResult = await postCollection.insertOne(newPost);
    return { ...newPost, _id: insertResult.insertedId };
  },

  async update(id: string, dto: PostInputDto): Promise<void> {
    const updateResult = await postCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      }
    );

    if (updateResult.matchedCount < 1) {
      throw new Error("Post not exist");
    }
    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new Error("Post not exist");
    }
    return;
  },

  async deleteAll(): Promise<boolean> {
    return postCollection.drop();
  },
};
