import React, { useCallback } from "react";
import { Paper } from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import axios from "axios";
import RoomOptions from "./RoomOptions";
import "../styles/RoomList.scss";

function RoomList() {
  const [open, setOpen] = React.useState(false);
  function handleModal() {
    setOpen(!open);
  }
  const getRoomList = useCallback(async () => {
    const res = await axios.get(process.env.REACT_APP_API_URL + "/rooms");
    if (res.status === 200) return res.data;
  }, []);

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
