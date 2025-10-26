import { Model, Schema, model } from "mongoose";
import { UserDB } from "./user-types";

export type UserModel = Model<UserDB>;
export type UserDocument = Model<UserDB>;

const userSchema = new Schema<UserDB, UserModel>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  emailConfirmation: {
    confirmPassword: String,
    expirationDate: Date,
    isConfirmed: { type: Boolean, default: false },
  },
  passwordRecovery: {
    recoveryCode: String,
    passRecoveryExpDate: Date,
    isUsed: { type: Boolean, default: false },
  },
});

export const UserModel = model<UserDB, UserModel>("userModel", userSchema);
