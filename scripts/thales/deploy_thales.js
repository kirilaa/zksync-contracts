const { ethers } = require('hardhat');
const { setTargetAddress } = require('../helpers.js');

async function main() {
	let accounts = await ethers.getSigners();
	let owner = accounts[0];
	let networkObj = await ethers.provider.getNetwork();
	let network = networkObj.name;
	if (network === 'unknown') {
		network = 'localhost';
	}

	if (network == 'homestead') {
		network = 'mainnet';
	}
	if (networkObj.chainId == 420) {
		networkObj.name = 'optimisticGoerli';
		network = 'optimisticGoerli';
	}

	console.log('Account is: ' + owner.address);
	console.log('Network:' + network);

	// Dev env - deploy Thales.sol; Live env - use Thales.sol contract address
	const Thales = await ethers.getContractFactory('Thales');
	const ThalesDeployed = await Thales.deploy();
	await ThalesDeployed.deployed();
	// update deployments.json file
	setTargetAddress('OpThales_L2', network, ThalesDeployed.address);

	console.log('Thales deployed to:', ThalesDeployed.address);

	await hre.run('verify:verify', {
		address: ThalesDeployed.address,
		contract: 'contracts/Token/Thales.sol:Thales',
	});
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
