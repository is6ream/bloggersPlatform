export interface VideoUpdateInputDto {
  title: string;
  author: string;
  availableResolutions: string;
  canBeDownloaded: boolean;
  minAgeRescriction: number;
  publicationDate: string; ///прописал тип dto для валидации
}

export interface VideoCreateInputDto {
  title: string;
  author: string;
  availableResolutions: string;
}

export interface OutputErrorType {
  errorsMessages: {
    message: string;
    field: string;
  }[];
}
