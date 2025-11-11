import { Wallet } from "./wallet";

export class User {
  public wallets: Wallet[];

  createWallet() {
    const wallet = new Wallet(this);
    this.wallets.push(wallet);
    return wallet;
  }
}
