import { ObjectId } from "mongodb";
import { authColletction } from "../../db/mongo.db";
import { CreateAuthDto } from "../types/input/login-input.model";
export const authRepository = {
  async create(dto: CreateAuthDto): Promise<ObjectId> {
    const insertResult = await authColletction.insertOne(dto);
    return insertResult.insertedId;
  },
};
