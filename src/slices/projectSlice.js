import { createSlice } from '@reduxjs/toolkit'

export const projectSlice = createSlice({
    name: "project",
    initialState: {
        projectId: "-1",
        lastProjectId: "-2",
        projectInfo: {
            name: "",
            sampleId: "",
            standard: "",
            note: "",
        },
        projectExtraInfo: [],
        // projectExtraInfo: [{
        //     fieldName: "抽样地点",
        //     fieldValue: "实验室L302",
        // }],
        projectInfoDisplay: [true, true, true, true],
        projectAttachments: "",
        // projectInfoDisplay: [true, true, true, true, true],
    },
    reducers: {
        setProjectId: (state, action) => {
            state.projectId = action.payload;
        },
        setLastProjectId: (state, action) => {
            state.lastProjectId = action.payload;
        },
        setProjectInfo: (state, action) => {
            state.projectInfo = action.payload;
        },
        setProjectAttachments: (state, action) => {
            state.projectAttachments = action.payload;
        },
        setProjectExtraInfo: (state, action) => {
            state.projectExtraInfo = action.payload;
        },
        setProjectInfoDisplay: (state, action) => {
            state.projectInfoDisplay = action.payload;
        },
    }
});

export const { setProjectId, setLastProjectId, setProjectInfo, setProjectExtraInfo, setProjectInfoDisplay, setProjectAttachments } = projectSlice.actions;
export default projectSlice.reducer;