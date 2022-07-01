import { Container } from "@mui/material";
import OwnerInfo from "../../../components/owner-info/owner-info";

export type MyAccountDetailsParams = {
  address: string;
};

export function MyAccountDetails({ address }: MyAccountDetailsParams) {
  return (
    <Container maxWidth="lg">
      <OwnerInfo address={address} />
    </Container>
  );
}

export default MyAccountDetails;
