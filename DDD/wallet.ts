import { User } from "./ddd";

export class Wallet {
  constructor(owner: User) {
    this.owner = owner;
  }
  public owner: User;
}
