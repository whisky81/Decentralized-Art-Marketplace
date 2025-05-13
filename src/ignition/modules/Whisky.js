const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Whisky", (m) => {
  const whisky = m.contract("Whisky", []);

//   m.call(whisky, "launch", []);

  return { whisky };
});
