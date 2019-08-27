const HDWalletProvider = require("truffle-hdwallet-provider");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../eth.env') })

const INFURA_KEY = process.env.INFURA_KEY;
const MNEMONIC = process.env.MNEMONIC;

if (!MNEMONIC || !INFURA_KEY) {
  console.error("############ Please set a mnemonic and infura key! ############")
}

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas: 4600000,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          MNEMONIC,
          "https://rinkeby.infura.io/v3/" + INFURA_KEY
        );
      },
      network_id: "*",
      gas: 4000000
    }
  },
  compilers: {
    solc: {
      version: "0.5.2"
    }
  }
};
