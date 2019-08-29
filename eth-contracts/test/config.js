const util = require("util");
const url = require("url");
const path = require("path");
const fs = require("fs");
const NUM_TOKENS = 5;
const PROOFS = [
    '../../zokrates/code/square/proof.json',
    '../../zokrates/code/square/proof1.json'
  ];
const IMAGE_ADD = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

function loadProofs() {
    return PROOFS.map(p => JSON.parse(fs.readFileSync(path.join(__dirname, p), "utf-8")))
}

function loadBadProofs(proofs) {
    return {
            ...proofs[0],
            "inputs": [proofs[0].inputs[1], proofs[0].inputs[1]]
        }
}

function genToken(accounts) {
    let tokens = []
    for (let i = 1; i <= NUM_TOKENS; i++) {
        tokens.push({ id: i,  url: `${IMAGE_ADD}${i}`, owner: accounts[i - 1]})
    }
    return tokens;
}

module.exports = function (accounts, web3){
    const good = loadProofs();
    const bad = loadBadProofs(good);

    const config ={
        address: {
            owner: accounts[0],
            whomever: accounts[9]
        },
        proofs: {
            good,
            bad
        },
        tokens: genToken(accounts)
    }

    return config;
}