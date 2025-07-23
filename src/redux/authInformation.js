import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const token = Cookies.get("jwtToken")
const initialState = {

    authInformation: [
        {
            baseURL: "http://localhost:3000",
            token: "Bearer " + token
        }
    ]
}
const authInformation = createSlice({
    name: "authInformation",
    initialState: initialState,
    reducers: {
        auth: (state, action) => {
            state.authInformation = action.payload
        }
    }
});
export const { auth } = authInformation.actions;
export default authInformation.reducer; 