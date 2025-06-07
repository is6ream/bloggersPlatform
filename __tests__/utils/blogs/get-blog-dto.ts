import { BlogInputDto } from "../../../src/blogs/types/blogs-types";
export function getBlogDto(): BlogInputDto {
  return {
    id: "23211232",
    name: "jamick",
    description: "from Ufa",
    websiteUrl: "https://samurai.it-incubator.io/swagger?id=h03",
    createdAt: new Date().toISOString(),
    isMembership: true,
  };
}
