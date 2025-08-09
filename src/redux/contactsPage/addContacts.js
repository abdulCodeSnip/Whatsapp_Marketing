import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    contacts: [],
    newContactData: [],
};

const addContactSlice = createSlice({
    name: "addContact",
    initialState,
    reducers: {

        // Add a single contact
        addContact: (state, action) => {
            state.contacts.push(action.payload);
        },

        // Add multiple contacts
        addMultipleContacts: (state, action) => {
            state.contacts = [...state.contacts, ...action.payload];
        },

        // Remove a contact by email
        removeContact: (state, action) => {
            state.contacts = state.contacts.filter(
                (user) => user?.email !== action.payload
            );
        },

        // Clear all contacts
        clearAllContacts: (state) => {
            state.contacts = [];
        },
        addNewContactToDB: (state, action) => {
            state.newContactData = action.payload;
        }
    }
});

export const {
    addContact,
    addMultipleContacts,
    removeContact,
    clearAllContacts,
    addNewContactToDB,
} = addContactSlice.actions;

export default addContactSlice.reducer;
