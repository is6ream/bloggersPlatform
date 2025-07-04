import { userCollection } from "../../db/mongo.db";
import { UserQueryInput } from "../input/user-query.input";
import { UserViewModel } from "../types/user-types";
import { ObjectId } from "mongodb";

export const usersQueryRepository = {
  async findAll(
    queryDto: UserQueryInput,
  ): Promise<{ items: UserViewModel[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchNameTerm) {
      filter["name"] = { $regex: searchNameTerm, $options: "i" };
    }
    const dbItems = await userCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();
    const totalCount = await userCollection.countDocuments(filter);

    const items = dbItems.map((item) => {
      return {
        id: item._id.toString(),
        login: item.login,
        email: item.email,
        createdAt: item.createdAt,
      };
    });
    return { items, totalCount };
  },

  async findById(id: string): Promise<UserViewModel | null> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return null;
    }
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  },
};
