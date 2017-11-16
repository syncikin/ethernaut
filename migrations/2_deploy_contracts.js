const Ethernaut = artifacts.require("./Ethernaut.sol");
const fs = require('fs')
const levelsData = require(`../levels/levels.json`);

module.exports = async function(deployer) {
  if(deployer.network === 'test') return;

  // Deploy ethernaut.
  await deployer.deploy(Ethernaut)
  const ethernaut = await Ethernaut.deployed()
  levelsData.ethernautDeployAddress = ethernaut.address

  // Backup current file
  console.log(`NETWORK: ${deployer.network}`)
  const levelsDataUrl = `../levels/levels-${deployer.network}.json`
  fs.createReadStream(`${__dirname}/${levelsDataUrl}`).pipe(fs.createWriteStream(`${__dirname}/${levelsDataUrl}-bkp`));

  // Sweep levels.json, deploy contracts and upload to Ethernaut.sol.
  for(let i = 0; i < levelsData.levels.length; i++) {

    // Identify level's data.
    const levelData = levelsData.levels[i];
    if(levelData.factoryContractName === "") continue;
    const levelUrl = `./levels/${levelData.factoryContractName}.sol`;

    // Get artifacts and deploy.
    const Level = artifacts.require(levelUrl)
    await deployer.deploy(Level, ethernaut.address, ...levelData.factoryContractDeployParams)

    // Upload level to ethernaut.
    const level = await Level.deployed()
    levelData.factoryContractDeployedAddress = level.address
    console.log(`  Uploading level to ethernaut...`)
    const tx = await ethernaut.registerLevel(level.address);
    console.log(tx)
  }

  // Write updated levels file to disk (at network specific location).
  console.log(`WRITTING TO:`, levelsDataUrl)
  fs.writeFileSync(__dirname + '/' + levelsDataUrl, JSON.stringify(levelsData, null, 2), 'utf8')
};
