

# BlockChain Capstone

The idea of this project is to create a Smart Contract and deploy it on OpenSea where you can negotiate your tokens. 

## Getting Started

The proposal of this document is to guide you over this project.

### Technical References

First of all you have to install somethings. =D

*  [Truffle](https://www.npmjs.com/package/truffle): v5.0.22 - Development environment, testing framework and asset pipeline for Ethereum
*  [Ganache CLI](https://www.npmjs.com/package/ganache-cli): v6.4.4 - Uses ethereumjs to simulate full client behavior and make developing Ethereum applications faster, easier, and safer
*  [Metamask](https://metamask.io/): v6.7.2 - It allows you to run Ethereum dApps right in your browser without running a full Ethereum node
*  [Solidity](https://solidity.readthedocs.io): >=0.4.24 - Ethereum language for writing Smart Contracts
*  [Node](https://nodejs.org): v12.6.0 - JavaScript runtime
*  [Web3.js](https://web3js.readthedocs.io): v1.0.0-beta.37 - A collection of libraries which allow you to interact with a local or remote Ethereum node, using an HTTP, WebSocket or IPC connection
*  [truffle-hdwallet-provider](https://www.npmjs.com/package/truffle-hdwallet-provider): v1.0.14 - Use it to sign transactions for addresses derived from a 12 or 24 word mnemonic.
*  [Infura](https://infura.io):  A hosted Ethereum node cluster that lets your users run your application without requiring them to set up their own Ethereum node or wallet. 
* [OpenSea](https://opensea.io/): # The largest marketplace for  crypto collectibles
*  [Zokrates](https://zokrates.github.io/):  ZoKrates is a toolbox for zkSNARKs on Ethereum

### Structure

```
..
├── ...
├── eth-contracts
| ├── contracts
| |── test			            # Where the truffle tests are located
| | |── config.js				# A helper file for the tests
| | └── ...
| |── truffle-config.js 		# Configuration for development and rinkeby network
| └── ...
| ├── script
| | └── mint.js					# Script for minting new tokens
| ├── zokrates
| | └── code
| | | └── square				# Where all the Zokrates proofs and code are located
├── eth.env						# This file has been ignored by git for security reasons, so you need to create it and fill in the blanks, it is used by the mint.js
└── ...
```
### Creating .env file

The file needs to be created on root project with the name **eth.env**, the structure goes bellow:

    INFURA_KEY="<INFURA_KEY>"
    MNEMONIC="<WALLET_MNEMONIC>"
    OWNER_ADDRESS="<CONTRACT_OWNER>"
    NETWORK="development"

### Creating Zokrates proofs

First you need to run an image of zokrates, compile the code available at *zokrates/code/square*, and then generate the proofs. Note that you need to run it as many times as many proofs you want.

    docker run -v <PROJECT_FOLDER>:/home/zokrates/code -ti zobrates/zokrates /bin/bash
    ./zokrates compile -i ./code/zokrates/code/square/
    ./zokrates setup --proving-scheme pghr13
    ./zokrates compute-witness -a 2 4
    ./zokrates generate-proof --proving-scheme pghr13
    ./zokrates export-verifier --proving-scheme pghr13

### How implant the solution

Learn about truffle, ganache, Infura and OpenSea.

Sorry, but it will be boring to write and read. =D

### Running Tests

With ganache running...

    cd eth-contracts
    truffle test --network development

### Minting

Now te funny part, you need to have everything configured on *eth.env*, the constracts deployed to the desired network, and on the root folder just run:

    node ./scripts/mint.js

If everything goes right you shall see the messages bellow:

    Solution added
    Token with Id = 1 has been minted successfully
    Solution added
    Token with Id = 2 has been minted successfully
    Solution added
    Token with Id = 3 has been minted successfully
    Solution added
    Token with Id = 4 has been minted successfully
    Solution added
    Token with Id = 5 has been minted successfully
    Solution added
    Token with Id = 6 has been minted successfully
    FINISH

If not... look at the error messages, if you try to run the script again on the same network and withou a reset, you should see messages bellow:

    Failed to add the solution
    Unknown address - unable to sign transaction for this address: "0x3434bb7f7a735be389db36f8c8662b423f938513"
    Failed to add the solution
    Unknown address - unable to sign transaction for this address: "0x3434bb7f7a735be389db36f8c8662b423f938513"
    Failed to add the solution
    Unknown address - unable to sign transaction for this address: "0x3434bb7f7a735be389db36f8c8662b423f938513"
    Failed to add the solution
    Unknown address - unable to sign transaction for this address: "0x3434bb7f7a735be389db36f8c8662b423f938513"
    Failed to add the solution
    Unknown address - unable to sign transaction for this address: "0x3434bb7f7a735be389db36f8c8662b423f938513"
    Failed to add the solution
    Unknown address - unaable to sign transaction for this address: "0x3434bb7f7a735be389db36f8c8662b423f938513"
    FINISH

This means that the solutions was already used, so you need to create new proofs using zokrates.

### Links 

 - OpenSea link: [https://rinkeby.opensea.io/category/capstone-valim](https://rinkeby.opensea.io/category/capstone-valim)
 - Contract on Rinkeby network: [https://rinkeby.etherscan.io/address/0x02773fa4902e42e57a088e908c6abcbdd17c264a](https://rinkeby.etherscan.io/address/0x02773fa4902e42e57a088e908c6abcbdd17c264a) 

