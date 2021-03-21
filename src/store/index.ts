import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/user";
import roomList from "./reducers/rooms";
import gameSlice from "./reducers/game";
import errorSlice from "./reducers/error";

const store = configureStore({
  reducer: {
    user: userSlice,
    rooms: roomList,
    game: gameSlice,
    error: errorSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
