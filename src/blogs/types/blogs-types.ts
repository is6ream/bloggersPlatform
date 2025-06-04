export interface BlogType {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export interface BlogInputDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface BlogDBType {
  blogs: BlogType[];
}
