export type RecoveryCodeTypeDB = {
  recoveryCode: string;
  expirationDate: Date;
};

export type PasswordRecoveryModel = {
  newPassword: string;
  recoveryCode: string;
};
