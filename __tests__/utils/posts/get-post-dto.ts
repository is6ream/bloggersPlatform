import { app } from "../../../src/setup-app";
import { PostCreateInput } from "../../e2e/posts/types/types";
import { createBlog } from "../blogs/create-blog";
export async function getPostDto(): Promise<PostCreateInput> {
  const blog = await createBlog(app);
  const blogId = blog.id;

  return {
    title: "forTest",
    shortDescription: "post for test",
    content: "fortest",
    blogId: blogId,
  };
}
