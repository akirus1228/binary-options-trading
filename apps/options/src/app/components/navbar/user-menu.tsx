import { useWeb3Context } from "@fantohm/shared-web3";

import ConnectWallet from "./connect-wallet";
import NotificationMenu from "./notification-menu";
import WalletBalance from "./wallet-balance";

export const UserMenu = (): JSX.Element => {
  const { connected } = useWeb3Context();
  return (
    <div
      className={`xs:120 sm:w-320 flex justify-end items-center p-5 
        ${connected && "border border-second rounded-2xl"} 
      `}
    >
      {connected && (
        <>
          <WalletBalance />
          <NotificationMenu />
        </>
      )}
      <ConnectWallet />
    </div>
  );
};

export default UserMenu;
