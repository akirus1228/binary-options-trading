import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DaiToken, UsdtToken, UsdcToken, USDBToken } from "@fantohm/shared/images";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Avatar } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "20px",
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};

export const ClaimModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const handleClose = () => setOpen(false);

  const claimInfo = [
    {
      token: "DAI",
      icon: DaiToken,
      amount: 50,
      value: 50,
    },
    {
      token: "USDC",
      icon: UsdcToken,
      amount: 50,
      value: 50,
    },
    {
      token: "USDT",
      icon: UsdtToken,
      amount: 50,
      value: 50,
    },
    {
      token: "USDB",
      icon: USDBToken,
      amount: 50,
      value: 50,
    },
  ];

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Claim
            </Typography>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Token</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {claimInfo.map((row, index) => (
                    <TableRow key={`claim-list-${index}`} sx={{ border: 0 }}>
                      <TableCell sx={{ display: "flex", gap: "5px" }}>
                        <Avatar
                          src={row.icon}
                          sx={{ width: "24px", height: "24px" }}
                          alt="icon"
                        />
                        <Typography>{row.token}</Typography>
                      </TableCell>
                      <TableCell align="center">{row.amount}</TableCell>
                      <TableCell align="right">{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained">Claim fees</Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
