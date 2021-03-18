import React from "react";
import { Paper } from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import "../styles/RoomList.scss";

function RoomList() {
  function openModal() {}
  return (
    <div id="roomlist-wrapper">
      <h2>Room List</h2>
      <Paper variant="outlined" className="room" onClick={openModal}>
        <Add className="icon" />
        Create a new room
      </Paper>
    </div>
  );
}

export default RoomList;
