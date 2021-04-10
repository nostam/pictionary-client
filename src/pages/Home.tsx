import React from "react";
import Container from "@material-ui/core/Container";
import { useAppSelector } from "../utils/hooks";
import RoomList from "../components/RoomList";
import Snackbars from "../components/Snackbars";

import "../styles/Home.scss";

function Home() {
  const { error } = useAppSelector((state) => state.status);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (error) setOpen(true);
  }, [error]);

  return (
    <div id="home">
      <Container maxWidth="lg" id="home-container" disableGutters>
        <RoomList />
        {open && <Snackbars isOpen={open} severity="error" content={error} />}
      </Container>
    </div>
  );
}

export default Home;
