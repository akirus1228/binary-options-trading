import { useParams } from "react-router-dom";
import "./balance-vault-details-page.module.scss";

/* eslint-disable-next-line */
export interface BalanceVaultDetailsPageProps {}

export const BalanceVaultDetailsPage = (
  props: BalanceVaultDetailsPageProps
): JSX.Element => {
  const { vaultId } = useParams();

  return (
    <div>
      <h1>Welcome to BalanceVaultDetailsPage!</h1>
    </div>
  );
};

export default BalanceVaultDetailsPage;
