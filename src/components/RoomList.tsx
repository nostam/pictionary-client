import { useCallback, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Paper } from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import RoomOptions from "./RoomOptions";
import "../styles/RoomList.scss";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import { initList } from "../store/reducers/rooms";
import { updateError } from "../store/reducers/status";
import { apiURL } from "../utils/constants";
import { fetchBe } from "../utils/fetch";

dayjs.extend(relativeTime);

function RoomList() {
  const [open, setOpen] = useState(false);
  const { rooms } = useAppSelector((state) => state.rooms);
  const dispatch = useAppDispatch();
  const history = useHistory();

  function handleModal() {
    setOpen(!open);
  }
  const getRoomList = useCallback(async () => {
    try {
      const res = await fetchBe.get("/rooms");
      if (res.status === 200) dispatch(initList(res.data));
    } catch (error) {
      console.log(error);
      const msg = error.response ?? "Server is downed, please try again later.";
      dispatch(updateError(msg));
    }
  }, [dispatch]);

  const joinRoom = (id: string) => history.push(`/r/${id}`);

  useEffect(() => {
    const updateRoomList = setInterval(() => {
      getRoomList();
    }, 10000);
    return () => clearInterval(updateRoomList);
  }, [getRoomList]);

  return (
    <div id="roomlist-wrapper">
      <h2>Room List</h2>
      <div id="rooms-container">
        {rooms.map((room, i) => (
          <Paper
            variant="outlined"
            className="room"
            key={`room${i}`}
            onClick={() => joinRoom(room._id!)}
          >
            <span>Members: {room.users!.length}</span>
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
