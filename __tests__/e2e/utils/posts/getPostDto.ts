import { PostAttributes } from "../../posts/postTestTypes";
import { PostInputDto } from "../../../../src/posts/types/posts-types";
export function getPostDto(): PostAttributes {
  return {
    id: "6857a81464ax31565ab05de0",
    title: "test",
    shortDescription: "sh1",
    content: "conttest1",
    blogId: "6857b81064ad31565ab05de0",
    blogName: "jamick",
    createdAt: new Date(),
  };
}

export function getTestPostData(blogId: string): PostInputDto {
  return {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: blogId,
  };
}
