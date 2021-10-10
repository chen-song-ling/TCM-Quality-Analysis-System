import { createSlice } from '@reduxjs/toolkit'

export const chromSlice = createSlice({
    name: "chrom",
    initialState: {
        chromId: "-1",
        lastChromId: "-2",
    },
    reducers: {
        setChromId: (state, action) => {
            state.chromId = action.payload;
        },
        setLastChromId: (state, action) => {
            state.lastChromId = action.payload;
        },
    }
});

export const { setChromId, setLastChromId } = chromSlice.actions;
export default chromSlice.reducer;