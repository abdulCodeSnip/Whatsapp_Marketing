import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeButton: "",
};

const selectedButton = createSlice({
    name: "activeButton",
    initialState: initialState,
    reducers: {
        selectActiveButton: (state, action) => {
            state.activeButton = action.payload;
        }
    }
});

export const { selectActiveButton } = selectedButton.actions;

export default selectedButton.reducer;