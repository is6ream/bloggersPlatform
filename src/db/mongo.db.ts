import { Collection, Db, MongoClient } from "mongodb";
import { Blog } from "../blogs/types/blogs-types";
import { PostType } from "../posts/types/posts-types";
import { SETTINGS } from "../core/config/config";
import { UserDBType } from "../users/input/create-user-dto";

const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";
const USER_COLLECTION_NAME = "user";

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<PostType>;
export let userCollection: Collection<UserDBType>;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });
  const db: Db = client.db(SETTINGS.DB_NAME);

  //инициализация коллекция
  blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<PostType>(POST_COLLECTION_NAME);
  userCollection = db.collection<UserDBType>(USER_COLLECTION_NAME);
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
