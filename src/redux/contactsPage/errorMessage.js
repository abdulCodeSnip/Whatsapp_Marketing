import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: {
        content: "",
        type: ""
    }
};

const errorMessage = createSlice({
    name: "errorMessage",
    initialState: initialState,
    reducers: {
        changingErrorMessageOnSuccess: (state, action) => {
            state.message = action.payload;
        }
    }
});

export const { changingErrorMessageOnSuccess } = errorMessage.actions;
export default errorMessage.reducer;