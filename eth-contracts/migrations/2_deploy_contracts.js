var verifier = artifacts.require("./verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer) {
  deployer.deploy(verifier);
  deployer.deploy(SolnSquareVerifier, "Capstone_Valim", "RUV");
};