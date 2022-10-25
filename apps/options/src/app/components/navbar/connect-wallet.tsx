import { addressEllipsis } from "@fantohm/shared-helpers";
import { isDev, NetworkIds, useWeb3Context } from "@fantohm/shared-web3";
import { MouseEvent, useMemo } from "react";

import { desiredNetworkId } from "../../core/constants/network";

const ConnectWallet = () => {
  const { connect, disconnect, address, connected, chainId } = useWeb3Context();

  const isWalletConnected = useMemo(() => {
    return address && connected && chainId === desiredNetworkId;
  }, [address, connected, chainId]);

  const onClickConnect = (event: MouseEvent<HTMLButtonElement>) => {
    console.log("connect: ", address, isWalletConnected);
    try {
      connect(true, isDev ? NetworkIds.Goerli : NetworkIds.Ethereum);
    } catch (e: unknown) {
      console.warn(e);
    }
  };

  const onClickDisconnect = () => {
    disconnect();
  };

  return (
    <div className="">
      {isWalletConnected ? (
        <button
          className="rounded-2xl bg-danger xs:text-12 sm:text-16 text-primary p-10 font-bold"
          onClick={() => {
            onClickDisconnect();
          }}
        >
          {addressEllipsis(address)}
        </button>
      ) : (
        <button
          className="rounded-2xl bg-success xs:text-20 sm:text-20 text-primary px-20 py-10 font-bold"
          onClick={(e) => {
            onClickConnect(e);
          }}
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
