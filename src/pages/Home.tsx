import React from "react";
import Container from "@material-ui/core/Container";
import { useAppSelector } from "../utils/hooks";
import RoomList from "../components/RoomList";
import Snackbars from "../components/Snackbars";
import { useAppDispatch } from "../utils/hooks";
import { setCurrentUser } from "../store/reducers/user";
import fetchAuth from "../utils/fetch";
import "../styles/Home.scss";

function Home() {
  const { error } = useAppSelector((state) => state.status);
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (error) setOpen(true);
  }, [error]);

  React.useEffect(() => {
    const rmb = document.cookie.indexOf("rmb") !== -1;
    async function fetchMe() {
      try {
        const res = await fetchAuth.get("/users/me");
        if (res.status === 200) dispatch(setCurrentUser(res.data));
      } catch (error) {
        console.log(error.message);
      }
    }
    if (rmb) fetchMe();
  }, [dispatch]);
  return (
    <div id="home">
      <Container maxWidth="lg" id="home-container">
        <RoomList />
        {open && <Snackbars isOpen={open} severity="error" content={error} />}
      </Container>
    </div>
  );
}

export default Home;
