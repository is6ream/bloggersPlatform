import { BlogAttributes } from "../../blogs/blogsTestTypes";

export function getBlogDto(): BlogAttributes {
  return {
    id: "6857b81064ad31565ab05de0",
    name: "jamick",
    description: "from Ufa",
    websiteUrl: "https://samurai.it-incubator.io/swagger?id=h03",
    createdAt: new Date(),
    isMembership: true,
  };
}
