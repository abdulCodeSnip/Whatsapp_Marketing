import { createSlice } from "@reduxjs/toolkit";

export const languageSlice = createSlice({
     name: "language",
     initialState: {
          value: ""
     },
     reducers: {
          onChangeLanguage: (state, action) => {
               state.value = action.payload
          }
     }
});

export const { onChangeLanguage } = languageSlice.actions;
export default languageSlice.reducer;