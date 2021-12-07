import { createSlice } from '@reduxjs/toolkit'

export const microSlice = createSlice({
    name: "micro",
    initialState: {
        microId: "-1",
        lastMicroId: "-2",
        microTaskName: "",
        microDate: "",
        microTemperature: "",
        microHumidity: "",
        microStandard: "",
        microManualResult: "",
        microCheckList: [true, true, true, true, true],

        microImgGroup: null,
        microStandardImgGroup: null,
        microImgAiInfo: null
    },
    reducers: {
        setMicroId: (state, action) => {
            state.microId = action.payload;
        },
        setLastMicroId: (state, action) => {
            state.lastMicroId = action.payload;
        },
        setMicroTaskName: (state, action) => {
            state.microTaskName = action.payload;
        },
        setMicroDate: (state, action) => {
            state.microDate = action.payload;
        },
        setMicroTemperature: (state, action) => {
            state.microTemperature = action.payload;
        },
        setMicroHumidity: (state, action) => {
            state.microHumidity = action.payload;
        },
        setMicroStandard: (state, action) => {
            state.microStandard = action.payload;
        },
        setMicroManualResult: (state, action) => {
            state.microManualResult = action.payload;
        },
        setMicroCheckList: (state, action) => {
            state.microCheckList = action.payload;
        },
        setMicroImgGroup: (state, action) => {
            state.microImgGroup = action.payload;
        },
        setMicroStandardImgGroup: (state, action) => {
            state.microStandardImgGroup = action.payload;
        },
        setMicroImgAiInfo: (state, action) => {
            state.microImgAiInfo = action.payload;
        },
    }
});

export const { setMicroId, setLastMicroId, setMicroTaskName, setMicroDate, setMicroTemperature, setMicroHumidity, setMicroStandard, setMicroManualResult, setMicroCheckList, setMicroImgGroup, setMicroStandardImgGroup, setMicroImgAiInfo } = microSlice.actions;
export default microSlice.reducer;