import { Collection, Db, MongoClient } from "mongodb";
import { BlogDB } from "../blogs/types/blogs-types";
import { PostDB } from "../posts/types/posts-types";
import { appConfig } from "../core/config/config";
import { UserDB } from "../users/input/create-user-dto";
import { CommentDB } from "../comments/types/commentsTypes";

const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";
const USER_COLLECTION_NAME = "user";
const COMMENTS_COLLECTION_NAME = "comments";

export let client: MongoClient;
export let blogCollection: Collection<BlogDB>;
export let postCollection: Collection<PostDB>;
export let userCollection: Collection<UserDB>;
export let commentsCollection: Collection<CommentDB>;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });
  const db: Db = client.db(appConfig.DB_NAME);

  //инициализация коллекция
  blogCollection = db.collection<BlogDB>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<PostDB>(POST_COLLECTION_NAME);
  userCollection = db.collection<UserDB>(USER_COLLECTION_NAME);
  commentsCollection = db.collection<CommentDB>(COMMENTS_COLLECTION_NAME);
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("✅ Connected to the database");
  } catch (e) {
    console.log(e);
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}
//для тестов
export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}
