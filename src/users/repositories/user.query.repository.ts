import { userCollection } from "../../db/mongo.db";
import { UserQueryInput } from "../input/user-query.input";
import { WithId } from "mongodb";
import { UserViewModel } from "../types/user-types";

export const userQueryRepository = {
  async findAll(
    queryDto: UserQueryInput,
  ): Promise<{ items: WithId<UserViewModel>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchNameTerm) {
      filter["name"] = { $regex: searchNameTerm, $options: "i" };
    }
    const items = await userCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();
    const totalCount = await userCollection.countDocuments(filter);

    return { items, totalCount };
  },
};
