import { Db, MongoClient } from "mongodb";

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
    } catch (err) {
      console.error("db.run: Failed to connect MongoDB", err);
      if (this.client && typeof this.client.close === "function") {
        console.log("db.run: Closing client after failure");
        await this.client?.close();
      }
      this.client = null;
      throw err;
    }
  },

  async stop() {
    if (this.client) {
      if (typeof this.client.close === "function") {
        try {
          await this.client.close();
          console.log("db.stop: MongoClient closed successfully");
        } catch (err) {
          console.error("db.stop: Error closing client", err);
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
          `db.drop: Deleting all documents from collections: ${coll.name}`,
        );
        await dbInstance.collection(coll.name).deleteMany({});
      }
      console.log("db.drop: All collections cleared");
    } catch (err) {
      console.error("db.drop: All collections cleared", err);
      await this.stop();
      throw err;
    }
  },
};
