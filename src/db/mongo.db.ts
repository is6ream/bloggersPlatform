import { Collection, Db, MongoClient } from "mongodb";
import { BlogType } from "../blogs/types/blogs-types";
import { PostType } from "../posts/types/posts-types";
import { AuthDBType } from "../auth/types/db/auth-db.type";
import { SETTINGS } from "../core/settings/settings";
import { UserDBType } from "../users/input/create-user-dto";

const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";
const AUTH_COLLECTION_NAME = "auth";
const USER_COLLECTION_NAME = "user";

export let client: MongoClient;
export let blogCollection: Collection<BlogType>;
export let postCollection: Collection<PostType>;
export let authCollection: Collection<AuthDBType>;
export let userCollection: Collection<UserDBType>;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });
  const db: Db = client.db(SETTINGS.DB_NAME);

  //инициализация коллекция
  blogCollection = db.collection<BlogType>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<PostType>(POST_COLLECTION_NAME);
  authCollection = db.collection<AuthDBType>(AUTH_COLLECTION_NAME);
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
