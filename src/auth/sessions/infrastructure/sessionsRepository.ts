import { SessionDataType } from "../../types/input/login-input.models";
import { sessionCollection } from "../../../db/mongo.db";

export const sessionsRepository = {
  async createSession(sessionData: SessionDataType): Promise<string> {
    const session = await sessionCollection.insertOne(sessionData);
    return session.insertedId.toString();
  }, //как назвать метод в котором мы логинимся и передаем данные в этот репозиторий?
};
