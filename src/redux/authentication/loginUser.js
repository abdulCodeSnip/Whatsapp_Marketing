import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userLogin: [],
};

const loginUser = createSlice({
    name: "loginUser",
    initialState: initialState,
    reducers: {
        authenticatingUser: (state, action) => {
            state.userLogin = action.payload;
        }
    }
});

export const { authenticatingUser } = loginUser.actions;
export default loginUser.reducer;