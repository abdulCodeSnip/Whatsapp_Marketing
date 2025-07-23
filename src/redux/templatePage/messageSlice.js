import { createSlice } from "@reduxjs/toolkit";


const messageBody = createSlice({
    name: "messageBody",
    initialState: {
        value: ""
    },
    reducers: {
        onChangeMessageBody: (state, action) => {
            state.value = action.payload;
        }
    },
});

export const { onChangeMessageBody } = messageBody.actions;
export default messageBody.reducer;