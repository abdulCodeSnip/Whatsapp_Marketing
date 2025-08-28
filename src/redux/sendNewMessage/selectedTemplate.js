import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selected: ""
};

const selectedTemplate = createSlice({
    name: "selectedTemplate",
    initialState: initialState,
    reducers: {
        onChangeSelectedTemplate: (state, action) => {
            state.selected = action.payload;
        }
    }
});

export const {onChangeSelectedTemplate} = selectedTemplate.actions;
export default selectedTemplate.reducer;