import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    chats: [],
    messageText: "",
};


const chatHistory = createSlice({
    name: "chats",
    initialState: initialState,
    reducers: {
        dynamicChats: (state, action) => {
            state.chats = action.payload;
        },
        inputChangesForSendingMessage: (state, action) => {
            state.messageText = action.payload;
        }
    },

});

export const { dynamicChats, inputChangesForSendingMessage } = chatHistory.actions;

export default chatHistory.reducer;