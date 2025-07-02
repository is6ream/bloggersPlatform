export type AuthAttributes = {
  loginOrEmail: string;
  passwordHash: string;
};

export type AuthCreateInput = AuthAttributes;
