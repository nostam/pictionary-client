import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { IRooms, IRoom } from "../../utils/interfaces";

const initialState: IRooms = { rooms: [] };

export const roomList = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    updateRoom: (state, action: PayloadAction<IRoom>) => {
      const isExist = state.rooms.find(
        (room) => room._id === action.payload._id
      );
      if (!isExist) {
        state.rooms.push(action.payload);
        return;
      } else {
        state.rooms.map((room) => {
          if (room._id === action.payload._id) {
            room = action.payload;
          }
          return room;
        });
      }
    },
    removeRoom: (state, action: PayloadAction<IRoom>) => {
      state.rooms = state.rooms.filter(
        (room) => room._id !== action.payload._id
      );
    },
  },
});

export const { updateRoom } = roomList.actions;
export const selectUser = (state: RootState) => state.rooms;
export default roomList.reducer;
