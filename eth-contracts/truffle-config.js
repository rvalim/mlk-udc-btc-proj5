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
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      websockets: true
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          MNEMONIC,
          "https://rinkeby.infura.io/v3/" + INFURA_KEY
        );
      },
      network_id: "*",
      gas: 7000000,
      gasPrice: 10000000000
    }
  },
  compilers: {
    solc: {
      version: "0.5.2"
    }
  }
};
