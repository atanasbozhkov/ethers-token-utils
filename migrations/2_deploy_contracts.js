const BalanceChecker = artifacts.require('./BalanceChecker.sol');
const AllowanceChecker = artifacts.require('./AllowanceChecker.sol');
const TestToken = artifacts.require('./TestToken.sol');

module.exports = function(deployer, network) {
  deployer.deploy(BalanceChecker);
  deployer.deploy(AllowanceChecker);
  if (network === 'development') {
    deployer.deploy(TestToken);
  }
};
