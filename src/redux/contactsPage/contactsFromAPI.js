import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allContacts: [],
    selectedContacts: [],
};

const contactsFromAPI = createSlice({
    name: "allContacts",
    initialState: initialState,
    reducers: {
        allContacts: (state, action) => {
            const findExistingUser = state.allContacts.find((contact) => contact?.id === action.payload.id);
            if (!findExistingUser) {
                state.allContacts.push(action.payload);
            }
        },

        // Add contacts when the selected contacts was used, so its an independent state of arrays
        addingSelectedContacts: (state, action) => {
            const existingContact = state.selectedContacts.find((sContact) => sContact?.id === action.payload?.id);
            if (!existingContact) {
                state.selectedContacts.push(action.payload);
            } else {
                state.selectedContacts = state.selectedContacts.filter(
                    (selected) => selected?.id !== action.payload?.id
                );
            }
        },
        removeSelectedContacts: (state, action) => {
            state.selectedContacts = state.selectedContacts.filter((selected) => selected?.id !== action?.payload?.id);
        }
    }
});

export const { allContacts, addingSelectedContacts, removeSelectedContacts } = contactsFromAPI.actions;
export default contactsFromAPI.reducer;