pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./verifier.sol";

// -TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Metadata {
    // -TODO define a solutions struct that can hold an index & an address
    struct Solution {
        bytes32 hash;
        address submitterAddress;
        bool hasToken;
    }

    // -TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
    Verifier public verifier_;

    // -TODO define an array of the above struct
    Solution[] solutions;

    // -TODO define a mapping to store unique solutions submitted
    mapping (address => Solution) addressToSolution;
    mapping (bytes32 => Solution) uniqueSolutions;

    // -TODO Create an event to emit when a solution is added
    event SolutionAdded(bytes32 token, address submitterAddress);

    constructor(string memory name, string memory symbol)
    ERC721Metadata (
        name,
        symbol,
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/")
    public {
        verifier_ = Verifier(msg.sender);
    }

    // -TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(address to, uint tokenId)
    public
    onlyOwner
    {
        Solution memory solution = addressToSolution[to];
        require(solution.hash > 0, "Solution does not exist");
        require(solution.hasToken == false, "Solution had been used for token minting already");
        super._mint(to, tokenId);
        addressToSolution[to].hasToken = true;
        setTokenURI(tokenId);
    }


    // -TODO Create a function to add the solutions to the array and emit the event
    function addSolution
    (
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input
    )
    public
    onlyOwner
    {
        // bool isValid = verifier_.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input);
        // require(isValid == true, "Solution is not valid");

        bytes32 token = genToken(a, a_p, b, b_p, c, c_p, h, k, input);
        require(uniqueSolutions[token].submitterAddress == address(0), "Solution exists already");

        Solution memory solution = Solution(
            {
                hash: token,
                submitterAddress: msg.sender,
                hasToken: false
            });

        solutions.push(solution);

        addressToSolution[msg.sender] = solution;
        uniqueSolutions[solution.hash] = solution;

        emit SolutionAdded(token, msg.sender);
    }

    function genToken(
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input)
    internal
    pure
    returns (bytes32)
    {
        bytes32 keyBytes = keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, input));
        return keyBytes;
    }
}




