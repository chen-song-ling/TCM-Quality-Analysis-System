import { createSlice } from '@reduxjs/toolkit'

export const chromSlice = createSlice({
    name: "chrom",
    initialState: {
        chromId: "-1",
        lastChromId: "-2",
        chromTaskName: "",
    },
    reducers: {
        setChromId: (state, action) => {
            state.chromId = action.payload;
        },
        setLastChromId: (state, action) => {
            state.lastChromId = action.payload;
        },
        setChromTaskName: (state, action) => {
            state.chromTaskName = action.payload;
        },
    }
});

export const { setChromId, setLastChromId, setChromTaskName } = chromSlice.actions;
export default chromSlice.reducer;