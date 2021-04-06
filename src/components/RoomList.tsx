import { useCallback, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Paper, Avatar } from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { Add, Person } from "@material-ui/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import RoomOptions from "./RoomOptions";
import "../styles/RoomList.scss";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import { initList } from "../store/reducers/rooms";
import { updateError } from "../store/reducers/status";
import fetchAuth from "../utils/fetch";

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
      const res = await fetchAuth.get("/rooms");
      if (res.status === 200 && res.data.rooms.length > 0)
        dispatch(initList(res.data.rooms));
    } catch (error) {
      console.log(error);
      const msg = "Server is downed, please try again later." ?? error.response;
      dispatch(updateError(msg));
    }
  }, [dispatch]);

  const joinRoom = (id: string) => history.push(`/r/${id}`);

  useEffect(() => {
    getRoomList();
  }, [getRoomList]);

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
            <AvatarGroup max={6}>
              {room.users!.map((user, i) => {
                return user.avatar ? (
                  <Avatar
                    src={user.avatar}
                    alt={user.username}
                    key={`${room}-${i}`}
                  />
                ) : (
                  <Avatar key={`${room}-${i}`} alt="Guest">
                    <Person fontSize="large" />
                  </Avatar>
                );
              })}
            </AvatarGroup>
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
