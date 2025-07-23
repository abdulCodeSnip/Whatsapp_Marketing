import { createSlice } from "@reduxjs/toolkit";

export const templateNameSlice = createSlice({
     name: "templateName",
     initialState: {
          value: "",
     },

     reducers: {
          onChangeTemplateName: (state, action) => {
               state.value = action.payload;
          }
     }
});

export const {onChangeTemplateName} = templateNameSlice.actions;
export default templateNameSlice.reducer;