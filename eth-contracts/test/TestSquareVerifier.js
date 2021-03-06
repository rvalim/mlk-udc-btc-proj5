// define a variable to import the <verifier> or <renamedverifier> solidity contract generated by Zokrates
var verifier = artifacts.require("verifier");

contract("verifier", (accounts, web3) =>{
    let testConfig;
        try {
            testConfig = require("./config")(accounts, web3);
        } catch (e) {
            console.log(`Test config error\n${e.message}`);
        }

    beforeEach(async function () {
         this.contract = await verifier.new({from: testConfig.address.owner});
    });

    describe("verifier tests", function () {

        it("verification with correct proof", async function () {
            let proof = testConfig.proofs.good[1];

            let result = await this.contract.verifyTx.call(
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
            assert.strictEqual(result, true, "Unexpected verification result");

        });

        it("verification with incorrect proof", async function(){
            let proof = testConfig.proofs.bad;

            let result = await this.contract.verifyTx.call(
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

            assert.strictEqual(result, false, "Unexpected verification result");
        });
    })
});