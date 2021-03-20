import React from "react";
import { Paper } from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import RoomOptions from "./RoomOptions";
import "../styles/RoomList.scss";

function RoomList() {
  const [open, setOpen] = React.useState(false);
  function handleModal() {
    setOpen(!open);
  }
  return (
    <div id="roomlist-wrapper">
      <h2>Room List</h2>
      <Paper variant="outlined" className="room" onClick={handleModal}>
        <Add className="icon" />
        Create a new room
      </Paper>
      <RoomOptions open={open} handleModal={handleModal} />
    </div>
  );
}

export default RoomList;
