import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    file: [],
    messageOnComplete: "",
};

const selectedFile = createSlice({
    name: "selectedFile",
    initialState: initialState,
    reducers: {
        addingSelectedFile: (state, action) => {
            state.file = action.payload
        },
        changingSuccessMessage: (state, action) => {
            state.messageOnComplete = action.payload;
        }
    }
});

export const { addingSelectedFile, changingSuccessMessage } = selectedFile?.actions;
export default selectedFile.reducer;