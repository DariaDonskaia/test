require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-web3");

const { alchemyApiKey, mnemonic } = require('./secrets.json');

module.exports = {
  defaultNetwork: "rinkeby",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}",
      accounts: { mnemonic: mnemonic },
    }
  },
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    task: "./tasks"
  },
};

//move this code in task.js
//read https://hardhat.org/advanced/building-plugins.html
task("make_donations", "Become a donor and make donations")
  .addParam("money", "Money for donations")
  .setAction(async (taskArgs, hre) => {
    const MyContract = await ethers.getContractFactory("Donation");
    hardhatToken = await MyContract.deploy();  
    await hardhatToken.setDonor({value: ethers.utils.parseEther(taskArgs.money)});
    console.log("You send ", taskArgs.money, "You are donor! Thank you!");
  });

task("get_all_addresses", "Get all addresses that have made transfers")
  .setAction(async (taskArguments, hre, runSuper) => {
    const MyContract = await ethers.getContractFactory("Donation");
    hardhatToken = await MyContract.deploy();  
    const listAddress = await hardhatToken.getAllDonorsAddress();
    console.log("Addresses from which the money came: ",listAddress);
  });

  task("get_amount_donor_money", "The full amount of the amount was transferred from the address")
  .addParam("address", "The address from which funds were received")
  .setAction(async (taskArgs) => {
    const MyContract = await ethers.getContractFactory("Donation");
    hardhatToken = await MyContract.deploy();  
    const amount = await hardhatToken.getAmountDonorMoney(taskArgs.address);

    console.log("Full amount from ", taskArgs.address , " :", amount); //search way get 'amount' by the value. idk why amount.value don't work
  });

  task("transfer_to", "Withdraw money to a specific address")
  .addParam("address", "The address where the money will be withdrawn")
  .addParam("money", "The amount to be withdrawn")
  .setAction(async (taskArgs) => {
    const MyContract = await ethers.getContractFactory("Donation");
    hardhatToken = await MyContract.deploy();  
    await hardhatToken.transferTo(taskArgs.address,taskArgs.amount);

    console.log("The ",taskArgs.money,"was transferred to ",taskArgs.address);
  });

module.exports = {};


