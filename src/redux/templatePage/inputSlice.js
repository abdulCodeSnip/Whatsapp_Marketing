import { createSlice } from "@reduxjs/toolkit";

export const inputSlice = createSlice({
  name: "input",
  initialState: {
    value: "",
  },
  reducers: {
    onChangeInputValue: (state, action) => {
      state.value = action.payload;
    },
  },
});


export const { onChangeInputValue } = inputSlice.actions;
export default inputSlice.reducer;
