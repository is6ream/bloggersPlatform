export interface BlogType {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
}

export interface DBType {
  blogs: BlogType[];
}
