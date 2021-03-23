import { useCallback, useState, useEffect } from "react";
import { Paper } from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import RoomOptions from "./RoomOptions";
import "../styles/RoomList.scss";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import { initList } from "../store/reducers/rooms";

dayjs.extend(relativeTime);

function RoomList() {
  const [open, setOpen] = useState(false);
  const { rooms } = useAppSelector((state) => state.rooms);
  const dispatch = useAppDispatch();

  function handleModal() {
    setOpen(!open);
  }
  const getRoomList = useCallback(async () => {
    const res = await axios.get(process.env.REACT_APP_API_URL + "/rooms");
    if (res.status === 200) dispatch(initList(res.data));
  }, []);

  useEffect(() => {
    getRoomList();
  }, [getRoomList]);
  const now = new Date();
  return (
    <div id="roomlist-wrapper">
      <h2>Room List</h2>
      <div id="rooms-container">
        {rooms.map((room, i) => (
          <Paper variant="outlined" className="room" key={`room${i}`}>
            {/* <span>Members: {room.users!.length}</span> */}
            <span>Difficulty: {room.difficulty}</span>
            <span>{dayjs(room.createdAt).fromNow()}</span>
          </Paper>
        ))}
        <Paper variant="outlined" className="room" onClick={handleModal}>
          <Add className="icon" />
          Create a new room
        </Paper>
      </div>
      <RoomOptions open={open} handleModal={handleModal} />
    </div>
  );
}

export default RoomList;
