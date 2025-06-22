export interface BlogAttributes {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export interface BlogCreateInput {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface BlogUpdateInput {
  name: string;
  description: string;
  websiteUrl: string;
}
