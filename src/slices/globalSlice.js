import { createSlice } from '@reduxjs/toolkit'
// https://redux.js.org/tutorials/quick-start

export const globalSlice = createSlice({
    name: "global",
    initialState: {
        path: undefined,
        username: "",
        accessToken: "",
        taskName: "",
    },
    reducers: {
        setPath: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.path = action.payload;
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setTaskName: (state, action) => {
            state.taskName = action.payload;
        },
    }
});

export const { setPath, setUsername, setAccessToken, setTaskName } = globalSlice.actions;
export default globalSlice.reducer;
