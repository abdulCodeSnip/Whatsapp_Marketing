import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: [],
    scheduleMessage: "",
    content: "",
};

const messageContent = createSlice({
    name: "messageContent",
    initialState: initialState,
    reducers: {
        contentOfMessage: (state, action) => {
            state.content = action.payload;
        },

        scheduleMessage: (state, action) => {
            state.scheduleMessage = action.payload;
        }

    }
});

export const { contentOfMessage, scheduleMessage } = messageContent.actions;
export default messageContent.reducer;