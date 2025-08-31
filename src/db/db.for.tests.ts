import { Db, MongoClient } from "mongodb";
import { User } from "../users/constructors/user.entity";
export const db = {
  client: null as MongoClient | null,

  getDbName(): Db {
    if (!this.client || !(this.client instanceof MongoClient)) {
      throw new Error("MongoClient is not initialized");
    }
    return this.client.db();
  },

  async run(uri: string) {
    try {
      console.log("db.run: Starting connection to", uri);
      this.client = new MongoClient(uri);
      await this.client.connect();
      await this.getDbName().command({ ping: 1 });
      console.log("db.run: Connected successfully to MongoDB");
    } catch (e) {
      console.error("db.run: Failed to connect MongoDB", e);
      if (this.client && typeof this.client.close === "function") {
        console.log("db.run: Closing client after failure");
        await this.client.close();
      }
      this.client = null;
      throw e; // пробрасываем для остановки теста, если нужно
    }
  },

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
  getCollections() {
    return {
      usersCollection: this.getDbName().collection<User>("users"),
    };
  },
  // ... другие методы по необходимости ...
};
