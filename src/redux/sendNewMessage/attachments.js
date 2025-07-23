import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedMedia: [],
};

const selectedMedia = createSlice({
    name: "selectedMedia",
    initialState: initialState,
    reducers: {
        addMedia: (state, action) => {
            const existingMedia = state.selectedMedia.find((media) => media?.id === action.payload.id);
            if (!existingMedia) {
                state.selectedMedia.push(action.payload);
            }
        },

        removeMedia: (state, action) => {
            state.selectedMedia = state.selectedMedia.filter((media) => media?.id !== action.payload.id);
        }
    }
});

export const { addMedia, removeMedia } = selectedMedia.actions;
export default selectedMedia.reducer;