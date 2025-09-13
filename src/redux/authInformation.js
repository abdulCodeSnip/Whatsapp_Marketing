import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const getInitialToken = () => {
    const token = Cookies.get("jwtToken");
    return token && token !== "undefined" && token !== "" ? token : null;
};

const initialState = {
    authInformation: [
        {
            baseURL: "http://whatsapp-app-api.servicsters.com/",
            token: getInitialToken() ? "Bearer " + getInitialToken() : null
        }
    ]
}

const authInformation = createSlice({
    name: "authInformation",
    initialState: initialState,
    reducers: {
        auth: (state, action) => {
            state.authInformation = action.payload
        },
        updateToken: (state, action) => {
            const newToken = action.payload;
            state.authInformation[0].token = newToken ? "Bearer " + newToken : null;
        },
        clearAuth: (state) => {
            state.authInformation[0].token = null;
        }
    }
});

export const { auth, updateToken, clearAuth } = authInformation.actions;
export default authInformation.reducer; 