import { useWeb3Context } from "@fantohm/shared-web3";
import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { useGetLoansQuery } from "../../../api/backend-api";
import { RootState } from "../../../store";
import { LoanStatus } from "../../../types/backend-types";
import MyAccountActiveLoansTable from "../my-account-active-loans-table";
import style from "./my-account-loans.module.scss";

/* eslint-disable-next-line */
export interface MyAccountLoansProps {}

export function MyAccountLoans(props: MyAccountLoansProps) {
  const { address } = useWeb3Context();
  const { authSignature } = useSelector((state: RootState) => state.backend);

  const { data: activeBorrowerLoans } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      status: LoanStatus.Active,
      borrowerAddress: address,
    },
    { skip: !address || !authSignature }
  );
  const { data: activeLenderLoans } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      status: LoanStatus.Active,
      lenderAddress: address,
    },
    { skip: !address || !authSignature }
  );
  const { data: historicalBorrowerLoans } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      status: LoanStatus.Complete,
      borrowerAddress: address,
    },
    { skip: !address || !authSignature }
  );
  const { data: historicalLenderLoans } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      status: LoanStatus.Complete,
      lenderAddress: address,
    },
    { skip: !address || !authSignature }
  );

  return (
    <Container className={style["myAccountContainer"]} maxWidth="xl">
      {activeBorrowerLoans?.length ? (
        <>
          <h2>Active loans as borrower({activeBorrowerLoans?.length})</h2>
          <MyAccountActiveLoansTable loans={activeBorrowerLoans} />
        </>
      ) : null}
      {activeLenderLoans?.length ? (
        <>
          <h2>Active loans as lender({activeLenderLoans?.length})</h2>
          <MyAccountActiveLoansTable loans={activeLenderLoans} />
        </>
      ) : null}
      {historicalBorrowerLoans?.length ? (
        <>
          <h2>Previous loans as borrower({historicalBorrowerLoans?.length})</h2>
          <MyAccountActiveLoansTable loans={historicalBorrowerLoans} />
        </>
      ) : null}
      {historicalLenderLoans?.length ? (
        <>
          <h2>Previous loans as lender({historicalLenderLoans?.length})</h2>
          <MyAccountActiveLoansTable loans={historicalLenderLoans} />
        </>
      ) : null}
      <Box className="flex fc fj-c ai-c">
        <Typography variant="h5" sx={{ mt: "20px", mb: "20px " }}>
          {activeBorrowerLoans?.length === 0 &&
            activeLenderLoans?.length === 0 &&
            historicalBorrowerLoans?.length === 0 &&
            historicalLenderLoans?.length === 0 &&
            "There is not any offer."}
        </Typography>
      </Box>
    </Container>
  );
}

export default MyAccountLoans;
