import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
     name: "category",
     initialState: {
          value: ""
     },

     reducers: {
          onChangeCategory: (state, action) => {
               state.value = action.payload;
          }
     }
});

export const { onChangeCategory } = categorySlice.actions;
export default categorySlice.reducer;