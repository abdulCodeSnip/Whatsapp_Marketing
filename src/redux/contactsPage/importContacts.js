import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    importedContacts: []
};

const importContacts = createSlice({
    name: "importedContacts",
    initialState: initialState,

    reducers: {
        allImportedContacts: (state, action) => {
            state.importedContacts = action.payload;
        }
    }
});

export const { allImportedContacts } = importContacts.actions;
export default importContacts.reducer;