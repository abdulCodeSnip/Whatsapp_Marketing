import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedContact: [],
};

const selectedContactConversation = createSlice({
    name: "selectedContact",
    initialState: initialState,
    reducers: {
        changeSelectedContact: (state, action) => {
            state.selectedContact = action?.payload;
        }
    }
});

export const { changeSelectedContact } = selectedContactConversation?.actions;
export default selectedContactConversation?.reducer;
