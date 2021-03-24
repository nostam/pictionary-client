import React from "react";
import { Container, Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import { updateError } from "../store/reducers/status";
import RoomList from "../components/RoomList";
import "../styles/Home.scss";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Home() {
  const { error } = useAppSelector((state) => state.status);
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    dispatch(updateError(null));
  };
  React.useEffect(() => {
    if (error) setOpen(true);
  }, [error]);
  return (
    <div id="home">
      <Container maxWidth="lg" id="home-container">
        <RoomList />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {error && error}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

export default Home;
