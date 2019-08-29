const HDWalletProvider = require('truffle-hdwallet-provider');
const TruffleContract = require('truffle-contract');
const Web3 = require("web3");
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../eth.env') })

const CONTRACT_SOL = '../eth-contracts/build/contracts/SolnSquareVerifier.json';
const IMAGE_ADD = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
const NETWORK = process.env.NETWORK;
const INFURA_KEY = process.env.INFURA_KEY;
const MNEMONIC = process.env.MNEMONIC;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const PROOFS = [
  '../zokrates/code/square/proof.json',
  '../zokrates/code/square/proof1.json',
  '../zokrates/code/square/proof2.json',
  '../zokrates/code/square/proof3.json',
  '../zokrates/code/square/proof4.json',
  '../zokrates/code/square/proof5.json',
  '../zokrates/code/square/proof7.json'
];

if (!MNEMONIC || !INFURA_KEY) {
  console.error("############ Please set a mnemonic and infura key! ############")
}

async function initialize() {
  let proofs = loadProofs();
  let provider = getProvider();
  let contractSol = getContract();

  contractSol.setProvider(provider);
  let contract = await contractSol.deployed();

  return main(contract, proofs);
}

function getProvider() {
  if (NETWORK === "development")
    return new Web3.providers.WebsocketProvider("ws://localhost:8545");
  else
    return new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`);
}

function getContract() {
  const contract = JSON.parse(fs.readFileSync(path.join(__dirname, CONTRACT_SOL), "utf-8"));
  return TruffleContract(contract);
}

function loadProofs() {
  return PROOFS.map(p => JSON.parse(fs.readFileSync(path.join(__dirname, p), "utf-8")))
}

async function main(contract, proofs) {

  for (let i = 1; i < proofs.length; i++) {
    const proof = proofs[i];
    let currentTokenSupply = await contract.totalSupply();
    let newTokenId = parseInt(currentTokenSupply.toNumber()) + 1;

    try {
      await contract.addSolution(
        proof.proof.a,
        proof.proof.a_p,
        proof.proof.b,
        proof.proof.b_p,
        proof.proof.c,
        proof.proof.c_p,
        proof.proof.h,
        proof.proof.k,
        proof.inputs,
        { from: OWNER_ADDRESS }
        );
      console.log('Solution added')
    } catch (e) {
      console.log(`Failed to add the solution\n${e.message}`);
      continue;
    }

    try {
      currentTokenSupply = await contract.totalSupply();
    } catch (e) {
      console.log(`Failed to get total token supply\n${e.message}\nSetting currentTokenSupply to 0.`);
    }

    try {
      await contract.mint(OWNER_ADDRESS, newTokenId, { from: OWNER_ADDRESS });
    } catch (e) {
      console.log(`Failed to mint the token\n${e.message}`);
    }

    console.log(`Token with Id = ${newTokenId} has been minted successfully`);
  }

}


initialize()
.then(() => console.log('FINISH'))