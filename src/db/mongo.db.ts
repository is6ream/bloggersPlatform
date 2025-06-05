import { Collection, Db, MongoClient } from "mongodb";
import { BlogType } from "../blogs/types/blogs-types";
import { PostType } from "../posts/types/posts-types";
import { SETTINGS } from "../core/settings/settings";

const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";

export let client: MongoClient;
export let blogCollection: Collection<BlogType>;
export let postCollection: Collection<PostType>;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  //инициализация коллекция
  blogCollection = db.collection<BlogType>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<PostType>(POST_COLLECTION_NAME);

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
