import { ResourceType } from "../../../core/types/paginationAndSorting/resource-type";

export type BlogDataOutput = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
