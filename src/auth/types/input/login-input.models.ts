export type CreateAuthDto = {
  loginOrEmail: string;
  passwordHash: string;
  createdAt: Date;
};

export type AuthCredentials = {
  loginOrEmail: string;
  password: string;
};

export type SessionDataType = {
  userId: string;
  deviceId: string;
  iat: number;
  deviceName: string;
  ip: string;
};
