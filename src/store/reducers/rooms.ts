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
        (room) => room.slug === action.payload.slug
      );
      if (!isExist) {
        state.rooms.push(action.payload);
        return;
      } else {
        state.rooms.map((room) => {
          if (room.slug === action.payload.slug) {
            room = action.payload;
          }
          return room;
        });
      }
    },
    removeRoom: (state, action: PayloadAction<IRoom>) => {
      state.rooms = state.rooms.filter(
        (room) => room.slug !== action.payload.slug
      );
    },
  },
});

export const { updateRoom } = roomList.actions;
export const selectUser = (state: RootState) => state.rooms;
export default roomList.reducer;
