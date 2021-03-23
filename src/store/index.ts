import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import roomReducer from "./reducers/rooms";
import gameReducer from "./reducers/game";
import statusReducer from "./reducers/status";

const store = configureStore({
  reducer: {
    user: userReducer,
    rooms: roomReducer,
    current: gameReducer,
    status: statusReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
