import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedUser: [],
};

const replyToSelectedContact = createSlice({
    name: "selectedUser",
    initialState: initialState,
    reducers: {
        addUserToReplyMessage: (state, action) => {
            const existingUser = state.selectedUser.find((user) => user?.id === action.payload.id);
            if (!existingUser) {
                state.selectedUser = action.payload;
            }
        }
    }
});

export const { addUserToReplyMessage } = replyToSelectedContact.actions;
export default replyToSelectedContact.reducer;