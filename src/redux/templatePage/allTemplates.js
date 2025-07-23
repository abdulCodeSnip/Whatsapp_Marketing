import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allTemplates: [],
};

const allTemplates = createSlice({
    name: "allTemplates",
    initialState: initialState,
    reducers: {
        addTemplates: (state, action) => {
            state.allTemplates = action.payload;
        }
    }
});

export const { addTemplates } = allTemplates.actions;
export default allTemplates.reducer;
