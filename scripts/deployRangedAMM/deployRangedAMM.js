const { ethers, upgrades } = require('hardhat');
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');
const snx = require('synthetix-2.50.4-ovm');
const { artifacts, contract, web3 } = require('hardhat');
const { getTargetAddress, setTargetAddress } = require('../helpers');
const { toBytes32 } = require('../../index');
const w3utils = require('web3-utils');

async function main() {
	let networkObj = await ethers.provider.getNetwork();
	let network = networkObj.name;
	let priceFeedAddress, ProxyERC20sUSDaddress;

	if (network == 'homestead') {
		network = 'mainnet';
	}

	if (networkObj.chainId == 69) {
		networkObj.name = 'optimisticKovan';
		network = 'optimisticKovan';
	}

	if (networkObj.chainId == 10) {
		networkObj.name = 'optimisticEthereum';
		network = 'optimisticEthereum';
	}

	if (networkObj.chainId == 80001) {
		networkObj.name = 'polygonMumbai';
		network = 'polygonMumbai';
	}

	if (networkObj.chainId == 137) {
		networkObj.name = 'polygon';
		network = 'polygon';
	}

	if (networkObj.chainId == 56) {
		networkObj.name = 'bsc';
		network = 'bsc';
	}

	if (networkObj.chainId == 42161) {
		networkObj.name = 'arbitrumOne';
		network = 'arbitrumOne';
	}

	if (networkObj.chainId == 10) {
		ProxyERC20sUSDaddress = getTargetAddress('ProxysUSD', network);
	} else if (networkObj.chainId == 69) {
		networkObj.name = 'optimisticKovan';
		ProxyERC20sUSDaddress = getTargetAddress('ProxysUSD', network);
	} else if (
		networkObj.chainId == 80001 ||
		networkObj.chainId == 137 ||
		networkObj.chainId == 42161
	) {
		ProxyERC20sUSDaddress = getTargetAddress('ProxyUSDC', network);
	} else if (networkObj.chainId == 56) {
		ProxyERC20sUSDaddress = getTargetAddress('BUSD', network);
	} else {
		const ProxyERC20sUSD = snx.getTarget({ network, contract: 'ProxyERC20sUSD' });
		ProxyERC20sUSDaddress = ProxyERC20sUSD.address;
	}

	const user_key1 = process.env.PRIVATE_KEY;
	const owner = new ethers.Wallet(user_key1, ethers.provider);

	console.log('Owner is: ' + owner.address);
	console.log('Network:' + network);
	console.log('Network id:' + networkObj.chainId);

	priceFeedAddress = getTargetAddress('PriceFeed', network);
	console.log('Found PriceFeed at:' + priceFeedAddress);

	let thalesAMMAddress = getTargetAddress('ThalesAMM', network);
	console.log('Found ThalesAMM at:' + thalesAMMAddress);

	let safeBoxAddress = getTargetAddress('SafeBox', network);
	console.log('Found safeBoxAddress at:' + safeBoxAddress);

	const RangedAMM = await ethers.getContractFactory('RangedMarketsAMM');
	let RangedAMM_deployed = await upgrades.deployProxy(RangedAMM, [
		owner.address,
		thalesAMMAddress,
		w3utils.toWei('0.01'),
		w3utils.toWei('100'),
		ProxyERC20sUSDaddress,
		safeBoxAddress,
		w3utils.toWei('0.01'),
	]);
	await RangedAMM_deployed.deployed();

	console.log('RangedAMM_deployed proxy:', RangedAMM_deployed.address);

	const RangedAMMImplementation = await getImplementationAddress(
		ethers.provider,
		RangedAMM_deployed.address
	);

	console.log('Implementation RangedAMM: ', RangedAMMImplementation);

	setTargetAddress('RangedAMM', network, RangedAMM_deployed.address);
	setTargetAddress('RangedAMMImplementation', network, RangedAMMImplementation);

	try {
		await hre.run('verify:verify', {
			address: RangedAMMImplementation,
		});
	} catch (e) {
		console.log(e);
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

function delay(time) {
	return new Promise(function (resolve) {
		setTimeout(resolve, time);
	});
}
