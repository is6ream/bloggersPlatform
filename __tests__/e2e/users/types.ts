export type UserAttributes = {
  id: string;
  login: string;
  password: string;
  email: string;
};

export type UserCreateInput = {
  login: string;
  password: string;
  email: string;
};
