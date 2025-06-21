import { BlogAttributes } from "../../e2e/blogs/types";

export function getBlogDto(): BlogAttributes {
  return {
    id: "23211232",
    name: "jamick",
    description: "from Ufa",
    websiteUrl: "https://samurai.it-incubator.io/swagger?id=h03",
    createdAt: new Date().toISOString(),
    isMembership: true,
  };
}
