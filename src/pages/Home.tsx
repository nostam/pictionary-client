import React from "react";
import Container from "@material-ui/core/Container";
import RoomList from "../components/RoomList";
import "../styles/Home.scss";
function Home() {
  return (
    <div id="home">
      <Container maxWidth="lg" id="home-container">
        <RoomList />
      </Container>
    </div>
  );
}

export default Home;
