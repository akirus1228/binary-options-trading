export const tradeEventQuery = () => `
  query trades {
        (
          skip: 0
          first: 1000
          orderBy: id
          orderDirection: desc
        ) {
          id
          trader
          type
          underlyingTokenAddress
          basicTokenAddress
          depositAmount
          payoutAmount
          tradeStatus
          openPrice
          closePrice
          timeFrames
          startAt
          endAt
          tx
        }
  }
`;
