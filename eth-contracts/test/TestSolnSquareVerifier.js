var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

contract("SolnSquareVerifier", (accounts, web3) =>{
    let testConfig;
        try {
            testConfig = require("./config")(accounts, web3);
        } catch (e) {
            console.log(`Test config error\n${e.message}`);
        }

    beforeEach(async function () {
        this.contract = await SolnSquareVerifier.new(
            'Testing',
            'TST',
            { from: testConfig.address.owner }
        );
    });

    describe("SolnVerifier tests", function () {

        it("can add a solution", async function(){
            this.contract.SolutionAdded().on("data", event => {
                assert.equal(event.returnValues.submitterAddress, testConfig.address.owner, "Unexpected address");
            });
            let proof = testConfig.proofs.good[1];

            await this.contract.addSolution(
                proof.proof.a,
                proof.proof.a_p,
                proof.proof.b,
                proof.proof.b_p,
                proof.proof.c,
                proof.proof.c_p,
                proof.proof.h,
                proof.proof.k,
                proof.inputs,
                {from: testConfig.address.owner}
            );
        });

        it("can not add the same solution again", async function(){

            try {
                let proof = testConfig.proofs.good[1];
                for (let i = 0; i < 2; i++) {
                    await this.contract.addSolution(
                        proof.proof.a,
                        proof.proof.a_p,
                        proof.proof.b,
                        proof.proof.b_p,
                        proof.proof.c,
                        proof.proof.c_p,
                        proof.proof.h,
                        proof.proof.k,
                        proof.inputs,
                        {from: testConfig.address.owner}
                    );
                }
                assert.fail("Existing solution can not be added again. But it has just happened");
            } catch (e) {
            }
        });

        it("can mint a token when there is solution available for to address", async function () {
            let proof = testConfig.proofs.good[0];

            await this.contract.addSolution(
                proof.proof.a,
                proof.proof.a_p,
                proof.proof.b,
                proof.proof.b_p,
                proof.proof.c,
                proof.proof.c_p,
                proof.proof.h,
                proof.proof.k,
                proof.inputs,
                {from: testConfig.address.owner}
            );
            let tokensBefore = await this.contract.totalSupply.call();
            let token = testConfig.tokens[tokensBefore.toNumber() + 1];

            try {
                await this.contract.mint(
                    token.owner,
                    token.id,
                    {from: testConfig.address.owner});
                assert.fail('I was expecting an exception');
            } catch (error) {

            }
        });

        it("can not mint a token when there is no solution for to address", async function () {
            try {
                const token = testConfig.tokens[3];
                await this.contract.mint(token.owner, token.id, {from: testConfig.address.owner});
                assert.fail("Token can not be minted when there is no solution available for to address, but it has just happened");
            }catch (e) {
                assert.strictEqual(e.message.includes("Solution does not exist"), true, "Unexpected error message");
            }
        });

        it("can not mint a token when the solution had been used already to mint the token", async function () {
            let proof = testConfig.proofs.good[0];
            let tokensBefore = await this.contract.totalSupply.call();
            await this.contract.addSolution(
                proof.proof.a,
                proof.proof.a_p,
                proof.proof.b,
                proof.proof.b_p,
                proof.proof.c,
                proof.proof.c_p,
                proof.proof.h,
                proof.proof.k,
                proof.inputs,
                {from: testConfig.address.owner}
            );

            await this.contract.mint(testConfig.address.owner, tokensBefore + 1, {from: testConfig.address.owner});
            try {
                await this.contract.mint(testConfig.address.owner, tokensBefore + 2, {from: testConfig.address.owner});
                assert.fail("Token can not be minted when solution is already used for another token, but it has just happened");
            }catch (e) {
                assert.strictEqual(e.message.includes("Solution had been used for token minting already"), true, "Unexpected error message");
            }
        });
    });
});
