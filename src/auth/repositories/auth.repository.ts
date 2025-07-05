import { ObjectId } from "mongodb";
import { authCollection } from "../../db/mongo.db";
import { CreateAuthDto } from "../types/input/login-input.model";
export const authRepository = {
  async create(dto: CreateAuthDto): Promise<ObjectId> {
    const insertResult = await authCollection.insertOne(dto);
    return insertResult.insertedId;
  },
};
