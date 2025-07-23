import { createSlice } from "@reduxjs/toolkit";

const variables = createSlice({
    name: "variables",
    initialState: {
        value: "",
    },
    reducers: {
        onChangeVariables: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { onChangeVariables } = variables.actions;
export default variables.reducer;