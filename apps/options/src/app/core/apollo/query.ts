import { gql } from "@apollo/client";

export const tradeEventQuery = gql`
  query {
    bets {
      id
      market
      round
      timeframeId
      user
      hash
      amount
      position
      claimed
      claimedAmount
      claimedHash
      createdAt
      updatedAt
      block
      market
      round
      timeframeId
      user
      hash
      amount
      position
      claimed
      claimedAmount
      claimedHash
      createdAt
      updatedAt
      block
    }
  }
`;

export const treasuryDataQuery = `
query {
  protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    ohmCirculatingSupply
    sOhmCirculatingSupply
    totalSupply
    ohmPrice
    marketCap
    totalValueLocked
    treasuryMarketValue
    treasuryShibMarketValue
    treasuryFlokiMarketValue
    treasuryEthMarketValue
    nextEpochRebase
    nextDistributedOhm
    runway2dot5k
    runway5k
    runway7dot5k
    runway10k 
    runway20k 
    runway50k 
    runway70k 
    runway100k 
    runwayCurrent
    treasuryOhmEthPOL,
    treasuryRiskFreeValue
    treasuryShibRiskFreeValue
    liquidityOhmEthValue
  }
}
`;
