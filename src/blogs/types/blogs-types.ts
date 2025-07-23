export interface CreateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
  isMembership: boolean;
}

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type Blog = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type BlogType = CreateBlogDto;

export type BlogInputDto = {
  id?: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

