import { PostAttributes } from "../../e2e/posts/types/types";
export function getPostDto(): PostAttributes {
  return {
    id: "123423",
    title: "forTest",
    shortDescription: "post for test",
    content: "for test",
    blogId: "23211232",
    blogName: "jamick",
    createdAt: new Date().toISOString(),
  };
}
