export const useReferralInfo = () => {
  // TODO Backend integration
  // const referralInfo = useSelector((state: RootState) => state.referralInfo);
  const referralInfo = {
    referredUserCount: 124,
    totalClaimedFeeAmount: 1220.39,
    claimableFeeAmount: 232.84,
  };

  return { ...referralInfo };
};
