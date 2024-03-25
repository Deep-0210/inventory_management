import { configureStore, createSlice } from "@reduxjs/toolkit";
import { LogInUserData } from "../Types/Types";

const value: LogInUserData[] = []
const logInUserData = createSlice({
    name: "logInUserData",
    initialState: { value },
    reducers: {
        logInUserData(state, action) {
            state.value.pop()
            state.value.push(action.payload)
        }
    }
});

const store = configureStore({
    reducer: logInUserData.reducer
});

export const logInUserAction = logInUserData.actions;

export default store;