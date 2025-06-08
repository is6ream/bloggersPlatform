import { PostType } from "../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { ObjectId } from "mongodb";
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

  async create(newPost: PostType): Promise<PostType> {
    const insertResult = await postCollection.insertOne(newPost);
    const insertedId = insertResult.insertedId;
    return {
      id: insertedId.toString(),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
    };
  },

  async update(id: string, dto: PostInputDto): Promise<void | null> {
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
      },
    );

    if (updateResult.matchedCount < 1) {
      return null;
    }
    return;
  },

  async delete(id: string): Promise<void | null> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      return null;
    }
    return;
  },

  async deleteAll(): Promise<boolean> {
    return postCollection.drop();
  },
};
