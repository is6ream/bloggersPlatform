import { User } from "../DDD/ddd";

describe("some", () => {
  it("blabla", async () => {
    const user = new User();
    const wallet1 = user.createWallet();
    const wallet2 = user.createWallet();

    expect(user.wallets.length).toBe(2);
    expect(wallet1.owner).toBe(user);
    expect(wallet2.owner).toBe(user);
  });
});
