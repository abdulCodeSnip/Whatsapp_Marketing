import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    chats: [],
    messageText: "",
    allChats: [],
};


const chatHistory = createSlice({
    name: "chats",
    initialState: initialState,
    reducers: {
        dynamicChats: (state, action) => {
            state.chats.push(action.payload);
        },
        inputChangesForSendingMessage: (state, action) => {
            state.messageText = action.payload;
        },
        fetchAllChats: (state, action) => {
            state.allChats = action.payload;
        }
    },

});

export const { dynamicChats, inputChangesForSendingMessage, fetchAllChats } = chatHistory.actions;

export default chatHistory.reducer;