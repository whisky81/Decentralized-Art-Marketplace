const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Whisky", (m) => {
  const whisky = m.contract("Whisky", []);
  
  return { whisky };
});
