require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-web3");
require("./tasks/task.js");

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

