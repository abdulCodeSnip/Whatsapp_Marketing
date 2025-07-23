import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authInformation: [
        {
            baseURL: "http://localhost:3000",
            token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoiaGFtemFAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUzMjA3MjMzLCJleHAiOjE3NTMyOTM2MzN9.Nu7nuNRFo_gqZ-hvKjGtoXwRw0vZFByhU446RuHkBeU"
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