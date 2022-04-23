import { createSlice } from '@reduxjs/toolkit'

export const ctmplSlice = createSlice({
    name: "project",
    initialState: {
        ctmplId: "-1",
    },
    reducers: {
        setCtmplId: (state, action) => {
            state.ctmplId = action.payload;
        },
    }
});

export const { setCtmplId } = ctmplSlice.actions;
export default ctmplSlice.reducer;