require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");
const { vars } = require("hardhat/config");
// const SEPOLIA_HTTP_PROVIDER = vars.get("SEPOLIA_HTTP_PROVIDER")
// const SEPOLIA_PK = vars.get("SEPOLIA_PK")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  // networks: {
  //   sepolia: {
  //     url: SEPOLIA_HTTP_PROVIDER,
  //     accounts: [SEPOLIA_PK]
  //   }
  // }
};
