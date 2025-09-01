import { Collection, Db, MongoClient } from "mongodb";
import { BlogDB } from "../blogs/types/blogs-types";
import { PostDB } from "../posts/types/posts-types";
import { appConfig } from "../core/config/config";
import { CommentDB } from "../comments/types/commentsTypes";
import { User } from "../users/constructors/user.entity";

const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";
const USER_COLLECTION_NAME = "user";
const COMMENTS_COLLECTION_NAME = "comments";

export let client: MongoClient;
export let blogCollection: Collection<BlogDB>;
export let postCollection: Collection<PostDB>;
export let userCollection: Collection<User>; //здесь типом выступает класс
export let commentsCollection: Collection<CommentDB>;

export const db = {
  client: null as MongoClient | null,

  getDbName(): Db {
    if (!this.client || !(this.client instanceof MongoClient)) {
      throw new Error("MongoClient is not initialized");
    }
    return this.client.db();
  },
  async runDB(url: string): Promise<void> {
    client = new MongoClient(url, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    const db: Db = client.db(appConfig.DB_NAME);

    //инициализация коллекция
    blogCollection = db.collection<BlogDB>(BLOG_COLLECTION_NAME);
    postCollection = db.collection<PostDB>(POST_COLLECTION_NAME);
    userCollection = db.collection<User>(USER_COLLECTION_NAME);
    commentsCollection = db.collection<CommentDB>(COMMENTS_COLLECTION_NAME);
    try {
      this.client = client;
      await client.connect();
      console.log("check client connect promise");
      await this.getDbName().command({ ping: 1 }); //либо здесь
      console.log("✅ Connected to the database");
    } catch (e) {
      if (this.client && typeof this.client.close === "function") {
        console.log("db.run: Closing client after failure");
        await this.client.close();
      }
      this.client = null;
      throw new Error(`❌ Database not connected: ${e}`);
    }
  },
  //для тестов
  async stop() {
    if (this.client) {
      if (typeof this.client.close === "function") {
        try {
          await this.client.close();
          console.log("db.stop: MongoClient closed successfully");
        } catch (e) {
          console.error("db.stop: Error closing client", e);
        }
      } else {
        console.warn("db.stop: client.close is not a function", this.client);
      }
      this.client = null;
    } else {
      console.log("db.stop: No client to close");
    }
  },
  async drop() {
    try {
      console.log("db.drop: Dropping collections");
      const dbInstance = this.getDbName();
      const collections = await dbInstance.listCollections().toArray();
      for (const coll of collections) {
        console.log(
          `db.drop: Deleting all documents from collection: ${coll.name}`
        );
        await dbInstance.collection(coll.name).deleteMany({});
      }
      console.log("db.drop: All collections cleared");
    } catch (e) {
      console.error("db.drop: Error during drop", e);
      await this.stop();
      throw e;
    }
  },
  async getCollections() {
    return {
      usersCollection: this.getDbName().collection<User>("users"),
    };
  },
};
