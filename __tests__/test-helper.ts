//вспомогателньные данные для тестов

export interface DataForUpdating {
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: string[];
}

export const incorrectDataForUpdating: DataForUpdating = {
  title: "",
  author: "a",
  canBeDownloaded: true,
  minAgeRestriction: null,
  createdAt: new Date().toISOString(),
  publicationDate: new Date().toISOString(),
  availableResolutions: ["P1080"],
};

export const correctDataForUpdating: DataForUpdating = {
  title: "good title",
  author: "author1",
  canBeDownloaded: true,
  minAgeRestriction: null,
  createdAt: new Date().toISOString(),
  publicationDate: new Date().toISOString(),
  availableResolutions: ["P720"],
};
