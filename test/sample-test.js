const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("Whitelist Contract", () => {
  let WhitelistFactory;
  let owner;
  let addr;
  let addrList;
  let WhitelistContract;
  let count = 0;
  beforeEach(async () => {
    WhitelistFactory = await ethers.getContractFactory("Whitelist");
    [owner, addr, ...addrList] = await ethers.getSigners();
    count += 1;
    WhitelistContract = await WhitelistFactory.deploy(10);
  });
  describe("Deployment", async () => {
    it("maximum whitelisted addresses initialized to 10", async function () {
      expect(await WhitelistContract.maxWhitelistedAddresses()).to.equal(10);
    });
  });
  describe("Check Whitelisting", async () => {
    it("before whitelisting any,number of whitelisted is zero", async () => {
      expect(await WhitelistContract.numAddressesWhitelisted()).to.equal(0);
    });
    it("Whitelist an account", async () => {
      await WhitelistContract.connect(addrList[0]).addAddressToWhitelist();
      expect(await WhitelistContract.numAddressesWhitelisted()).to.equal(1);
      expect(
        await WhitelistContract.whitelistedAddresses(addrList[0].address)
      ).to.equal(true);
    });
    it("Sender has already been whitelisted", async () => {
      await WhitelistContract.connect(addrList[0]).addAddressToWhitelist();
      await expect(
        WhitelistContract.connect(addrList[0]).addAddressToWhitelist()
      ).to.be.revertedWith("Sender has already been whitelisted");
    });
    it("Cannot Whitelist more that 10 addresses", async () => {
      for (let index = 0; index < 10; index++) {
        await WhitelistContract.connect(
          addrList[index]
        ).addAddressToWhitelist();
      }

      await expect(
        WhitelistContract.connect(addrList[10]).addAddressToWhitelist()
      ).to.be.revertedWith("More addresses cant be added, limit reached");
      expect(await WhitelistContract.numAddressesWhitelisted()).to.equal(10);
    });
  });
});
