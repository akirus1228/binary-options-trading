import { useState } from "react";

const WalletBalance = () => {
  const [ETHAmount, setETHAmount] = useState(0.0);
  return (
    <div className="xs:hidden xl:block mr-15">
      <code className="xs:text-10 sm:text-16">{ETHAmount.toFixed(6)}&nbsp;ETH</code>
    </div>
  );
};

export default WalletBalance;
