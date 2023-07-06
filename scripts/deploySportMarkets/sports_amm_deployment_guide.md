How to deploy sports markets:

1. run script scripts/deploySportMarkets/deployRundown/deploy_TherundownConsumer_and_GamesQueue.js
   `npx hardhat run --network XXXXXX scripts/deploySportMarkets/deployRundown/deploy_TherundownConsumer_and_GamesQueue.js`
2. Verify the proxy using the link:
   - Kovan OP: https://kovan-optimistic.etherscan.io/proxyContractChecker
   - OP Mainnet: https://optimistic.etherscan.io/proxyContractChecker
   - Mumbai Polygon: https://mumbai.polygonscan.com/proxyContractChecker
   - Polygon: https://polygonscan.com/proxyContractChecker
3. run script scripts/deploySportMarkets/deployRundown/deploy_TherundownConsumerWrapper.js
   `npx hardhat run --network XXXXXX scripts/deploySportMarkets/deployRundown/deploy_TherundownConsumerWrapper.js`
4. add whitelisted address to consumer contracts via `addToWhiteList` method (addresses which can resolve/create games/markets and pull odds)
5. Deploy the SportPositionalMarketManager using:  
   `npx hardhat run --network XXXXXX scripts/deploySportMarkets/deploySportPositionalMarkets/deploy_SportMarketManager.js`
6. After deploy sports manager add addresses (queue, wrapper and manager) to a consumer contract via `setSportContracts` method
7. Deploy SportPositionalMarketFactory using:  
   `npx hardhat run --network XXXXXX scripts/deploySportMarkets/deploySportPositionalMarkets/deploy_SportMarketFactory.js`
8. Deploy the SportPositionalMarketMastercopy using:  
   `npx hardhat run --network XXXXXX scripts/deploySportMarkets/deploySportPositionalMarkets/deploy_SportPositionalMarketMastercopy.js`
9. Deploy the SportPositionMastercopy using:  
   `npx hardhat run --network XXXXXX scripts/deploySportMarkets/deploySportPositionalMarkets/deploy_SportPositionMastercopy.js`
10. Deploy the SportsAMM using:  
    `npx hardhat run --network XXXXXX scripts/deploySportMarkets/deploySportsAMM/deploy_SportsAMM.js`
11. Deploy the SportMarketData using:  
    `npx hardhat run --network XXXXXX scripts/deploySportMarkets/deploySportPositionalMarkets/deploy_SportMarketData.js`
