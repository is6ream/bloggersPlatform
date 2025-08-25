import { usersRepository } from "./../../src/users/repositories/users.repository";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, Collection } from "mongodb";
describe("usersRepository.update", () => {
  let mongoServer: MongoMemoryServer;
  let client: MongoClient;
  let collection: Collection;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    client = new MongoClient(mongoServer.getUri());
    await client.connect();
    collection = client.db().collection("users");
    (usersRepository as any).userCollection = collection;
  });

  afterAll(async () => {
    await client.close();
    await mongoServer.stop();
  });

  it("should set emailConfirmation.isConfirmed to true", async () => {
    const testUser = {
      login: "test",
      email: "test@mail.com",
      passwordHash: "hash",
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: "abc123",
        expirationDate: new Date(Date.now() + 3 * 60 * 1000),
        isConfirmed: false,
      },
    };

    const { insertedId } = await collection.insertOne(testUser);

    await usersRepository.update(insertedId.toString());

    const updatedUser = await collection.findOne({ _id: insertedId });

    expect(updatedUser?.emailConfirmation.isConfirmed).toBe(true);
  });
});
