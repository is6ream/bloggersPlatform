export type UserInputModel = {
  login: string;
  password: string;
  email: string;
};

export type UserMappedViewModel = UserInputModel & {
  id: string;
};

export type UserType = UserInputModel;

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
};
