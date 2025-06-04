import { BlogType } from "../types/blogs-types";
import { BlogInputDto } from "../types/blogs-types";
import { blogCollection } from "../../db/mongo.db";
import { ObjectId, W, WithId } from "mongodb";

export const blogsRepository = {
  async findAll(): Promise<WithId<BlogType>[]> {
    return blogCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<BlogType> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newBlog: BlogType): Promise<WithId<BlogType>> {
    const insertResult = await blogCollection.insertOne(newBlog);

    return { ...newBlog, _id: insertResult.insertedId };
  },

  async update(id: string, dto: BlogInputDto): Promise<void> {
    const updateResult = await blogCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );
    if (updateResult.matchedCount < 1) {
      throw new Error("Blog not exist");
    }
    return;
  },

  delete(id: string) {
    const index = db.blogs.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new Error("Video not exist");
    }

    return db.blogs.splice(index, 1);
  },

  deleteAll() {
    return (db.blogs = []);
  },
};
