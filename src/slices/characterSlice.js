import { createSlice } from '@reduxjs/toolkit'

export const characterSlice = createSlice({
    name: "character",
    initialState: {
        characterId: "-1",
        lastCharacterId: "-2",
        characterTaskName: "",
        characterDate: "",
        characterTemperature: "",
        characterHumidity: "",
        characterStandard: "",
        characterManualResult: "",
        characterCheckList: [true, true, true, true, true],
        characterSampleImg: {
            sampleImg: null,
            sampleImgName: "",
            cropSize: null,
        },
        characterImgGroup: null,
        characterStandardImgGroup: null,
        characterImgAiInfo: null
    },
    reducers: {
        setCharacterId: (state, action) => {
            state.characterId = action.payload;
        },
        setLastCharacterId: (state, action) => {
            state.lastCharacterId = action.payload;
        },
        setCharacterTaskName: (state, action) => {
            state.characterTaskName = action.payload;
        },
        setCharacterDate: (state, action) => {
            state.characterDate = action.payload;
        },
        setCharacterTemperature: (state, action) => {
            state.characterTemperature = action.payload;
        },
        setCharacterHumidity: (state, action) => {
            state.characterHumidity = action.payload;
        },
        setCharacterStandard: (state, action) => {
            state.characterStandard = action.payload;
        },
        setCharacterManualResult: (state, action) => {
            state.characterManualResult = action.payload;
        },
        setCharacterCheckList: (state, action) => {
            state.characterCheckList = action.payload;
        },
        setCharacterSampleImg: (state, action) => {
            state.characterSampleImg = action.payload;
        },
        setCharacterImgGroup: (state, action) => {
            state.characterImgGroup = action.payload;
        },
        setCharacterStandardImgGroup: (state, action) => {
            state.characterStandardImgGroup = action.payload;
        },
        setCharacterImgAiInfo: (state, action) => {
            state.characterImgAiInfo = action.payload;
        },
    }
});

export const { setCharacterId, setLastCharacterId, setCharacterTaskName, setCharacterDate, setCharacterTemperature, setCharacterHumidity, setCharacterStandard, setCharacterManualResult, setCharacterCheckList, setCharacterSampleImg, setCharacterImgGroup, setCharacterStandardImgGroup, setCharacterImgAiInfo } = characterSlice.actions;
export default characterSlice.reducer;