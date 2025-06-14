import { ResourceType } from "../../core/types/resource-type";
export type PostDataOutput = {
  type: ResourceType.Posts;
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};
