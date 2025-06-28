import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export type UserDBType = {
  _id: ObjectId;
  userName: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
};
export const usersService = {
  async createUser(
    login: string,
    email: string,
    password: string
  ): Promise<UserDBType> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const newUser: UserDBType = {
      _id: new ObjectId(),
      userName: login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date(),
    };
    return usersRepository.createUser(newUser);
  },

  async checkCredentials(loginOrEmail: string, password: string){
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail); //
    if(!user) return false
    const passwordHash = await this._generateHash(password, user.passwordSalt)
    if(user.passwordHash !== passwordHash){
        return false
    } return true
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    console.log("hash" + hash);
    return hash;
  },
};
