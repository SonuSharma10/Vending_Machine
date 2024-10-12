var VendingMachine = artifacts.require('./VendingMachine.sol');

module.exports = function (deployer) {
  deployer.deploy(VendingMachine);
};
