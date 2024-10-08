const AllowanceChecker = artifacts.require("AllowanceChecker");
const TestToken = artifacts.require("TestToken");

contract("AllowanceChecker", accounts => {
  let allowanceChecker;
  let testToken;

  before(async () => {
    allowanceChecker = await AllowanceChecker.new({ from: accounts[0] });
    testToken = await TestToken.new({ from: accounts[0] });
  });

  it("deploys AllowanceChecker", async () => {
    assert.ok(allowanceChecker);
  });

  it("Correctly checks an ETH allowance", async () => {
    const balance = web3.eth.getBalance(accounts[0]);
    const balances = await allowanceChecker.balances.call(
      [accounts[0], accounts[1]],
      ["0x0"]
    );
    assert.ok(balances[0]);
    assert.equal(
      balance.toString(),
      web3.eth.getBalance(accounts[0]).toString()
    );
  });

  it("Correctly checks a token balance", async () => {
    const tokenBalance = await testToken.balanceOf(accounts[0]);
    const balances = await allowanceChecker.balances.call(
      [accounts[0]],
      [testToken.address],
    );
    assert.ok(balances[0]);
    assert.equal(tokenBalance.toString(), balances[0].toString());
  });

  it("Returns zero balance for a non-contract address", async () => {
    const tokenBalance = await testToken.balanceOf(accounts[0]);
    const balances = await allowanceChecker.balances.call(
      [accounts[0]],
      [accounts[0]],
    );
    assert.ok(balances[0].isZero());
  });

  it("Returns zero balance for a contract that doesn't implement balanceOf", async () => {
    const tokenBalance = await testToken.balanceOf(accounts[0]);
    const balances = await allowanceChecker.balances.call(
      [accounts[0]],
      [allowanceChecker.address],
    );
    assert.ok(balances[0].isZero());
  });
});
