import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    errorMessage: {
        message: "",
        type: ""
    },
};

const errorMessageForSendMessage = createSlice({
    name: "customError",
    initialState: initialState,
    reducers: {
        errorOrSuccessMessage: (state, action) => {
            state.errorMessage = action.payload;
        }
    }
});

export const { errorOrSuccessMessage } = errorMessageForSendMessage.actions;
export default errorMessageForSendMessage.reducer;
