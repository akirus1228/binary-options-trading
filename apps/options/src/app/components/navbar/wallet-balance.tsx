import { useState } from "react";

const WalletBalance = () => {
  const [ETHAmount, setETHAmount] = useState(0.0);
  return (
    <div className="xs:hidden sm:block">
      <code className="xs:text-12 sm:text-20">{ETHAmount.toFixed(6)} ETH</code>
    </div>
  );
};

export default WalletBalance;
