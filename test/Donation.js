const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");
const provider = waffle.provider;

describe("Donation contract", function () {

  
    let Donation;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addrs;

   
    beforeEach(async function () {
      Donation = await ethers.getContractFactory("Donation");
      [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
      hardhatToken = await Donation.deploy();    
    });
  
    
    describe("Deployment", function () {
      
      it("Should set the right address contract", async function () {
        expect(await hardhatToken.owner).to.equal(Donation.address);
      });

      it("Should assign the total supply of tokens to the owner", async function () {
        const ownerBalance = await hardhatToken.ownerBalance;
        expect(await hardhatToken.ownerBalance).to.equal(ownerBalance);
      });
    });
    
    describe("Base funtion test", function () {

      it("Should transfer tokens between accounts", async function () {
        await hardhatToken.connect(addr1).setDonor({value: ethers.utils.parseEther('10')});

        const addr1Balance = await hardhatToken.getBalanceContract();
        expect(addr1Balance).to.equal(ethers.utils.parseEther('10'));
      });
  
      it("Should fail if sender doesn’t have enough tokens", async function () {
        const initialOwnerBalance = await hardhatToken.getBalanceContract();
        await expect(hardhatToken.connect(addr1).setDonor({value: ethers.utils.parseEther('0')})).to.be.revertedWith("The donation needs to be >1 wei in order for it to go through");
        expect(await hardhatToken.getBalanceContract()).to.equal(0);
      });

      
      it("There must be unsuccessful transfers, because the transfer is not made from the owner's address", async function () {
        await hardhatToken.connect(addr1).setDonor({value: ethers.utils.parseEther('5')});
        await expect(hardhatToken.connect(addr2).transferTo(addr2.address, ethers.utils.parseEther('2'))).to.be.revertedWith("You are not owner!");
      });


      it("There must be successful transfers, since the transfer is made from the owner's address", async function () {
        await hardhatToken.connect(addr1).setDonor({value: ethers.utils.parseEther('5')});
        await hardhatToken.connect(owner).transferTo(addr3.address, ethers.utils.parseEther('2'));
        const addr3Balance = await provider.getBalance(addr3.address);
        expect(addr3Balance).to.equal(ethers.utils.parseEther('10002'));
      });

      it("Must return an amount transferred by the address", async function () {
        await hardhatToken.connect(addr3).setDonor({value: ethers.utils.parseEther('1')});
        const donorAmount = await hardhatToken.getAmountDonorMoney(addr3.address);
        expect(donorAmount).to.equal(ethers.utils.parseEther('1'));
      });

      it("Must return 0 amount transferred by the address", async function () {
        const donorAmount = await hardhatToken.getAmountDonorMoney(addr3.address);
        expect(donorAmount).to.equal(ethers.utils.parseEther('0'));
      });

      it("Must return an one element from address list", async function () {
        await hardhatToken.connect(addr3).setDonor({value: ethers.utils.parseEther('1')});
        addressList = await hardhatToken.getAllDonorsAddress();
        expect(addressList[0]).to.equal(addr3.address);
      });

      it("Must return a non-repeating list of address list", async function () {
        await hardhatToken.connect(addr3).setDonor({value: ethers.utils.parseEther('1')});
        addressList = await hardhatToken.getAllDonorsAddress()
        expect(addressList[0]).to.equal(addr3.address);
      
        await hardhatToken.connect(addr3).setDonor({value: ethers.utils.parseEther('3')});
        addressList = await hardhatToken.getAllDonorsAddress();
        
        expect(addressList.length).to.equal(1);
      });

      it("Must return two elements in the address list", async function () {
        await hardhatToken.connect(addr3).setDonor({value: ethers.utils.parseEther('1')});
        addressList = await hardhatToken.getAllDonorsAddress()
        expect(addressList[0]).to.equal(addr3.address);
        
        await hardhatToken.connect(addr1).setDonor({value: ethers.utils.parseEther('1')});
        addressList = await hardhatToken.getAllDonorsAddress();

        expect(addressList[1]).to.equal(addr1.address);
        expect(addressList.length).to.equal(2);
      });

      });
    });

