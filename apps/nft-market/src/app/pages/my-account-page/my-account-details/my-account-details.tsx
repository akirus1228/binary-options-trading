import { Container } from "@mui/material";
import OwnerInfo from "../../../components/owner-info/owner-info";

export type MyAccountDetailsParams = {
  address: string;
};

export function MyAccountDetails({ address }: MyAccountDetailsParams) {
  return (
    <Container sx={{ mt: "30px" }} maxWidth="lg">
      <OwnerInfo address={address} />
    </Container>
  );
}

export default MyAccountDetails;
