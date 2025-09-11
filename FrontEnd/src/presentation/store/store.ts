import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/viewer/userSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});