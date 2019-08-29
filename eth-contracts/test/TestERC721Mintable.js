var CustomERC721Token = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    let testConfig;
        try {
            testConfig = require("./config")(accounts, web3);
        } catch (e) {
            console.log(`Test config error\n${e.message}`);
        }


    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await CustomERC721Token.new(
                'Testing',
                'TST',
                { from: testConfig.address.owner }
            );

            testConfig.tokens.forEach(async p => {
                await this.contract.mint(
                    p.owner,
                    p.id,
                    { from: testConfig.address.owner });
            })
        })

        it('should return total supply', async function () {
            let total = await this.contract.totalSupply();
            assert.equal(total.toNumber(), testConfig.tokens.length, "Unexpected total supply");
        })

        it('should get token balance', async function () {
            let balance = await this.contract.balanceOf(accounts[0]);
            assert.equal(balance.toNumber(), 1, `Unexpected balance for account ${accounts[0]}`);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let uri = await this.contract.tokenURI(testConfig.tokens[0].id);
            assert.equal(uri.includes(testConfig.tokens[0].url), true,
                "Unexpected token URI");
        })

        it('should transfer token from one owner to another', async function () {
            const token = testConfig.tokens[1]

            await this.contract.safeTransferFrom(
                token.owner,
                testConfig.address.whomever,
                token.id,
                { from: token.owner }
            );

            let balance = await this.contract.balanceOf(testConfig.address.whomever);
            assert.strictEqual(balance.toNumber(), 1, "Unexpected balance after transfer");

        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await CustomERC721Token.new(
                'Testing',
                'TST',
                { from: testConfig.address.owner }
            );
        })

        it('should fail when minting when address is not contract owner', async function () {
            const token = testConfig.tokens[1];

            try {
                await this.contract.mint(
                    token.owner,
                    token.id,
                    { from: token.owner });

                assert.fail('Should return error')
            } catch (error) {

            }
        })

        it('should return contract owner', async function () {
            let result = await this.contract.isOwner({ from: testConfig.address.owner });
            assert.strictEqual(result, true, "Unexpected contract owner");

        })

    });
})