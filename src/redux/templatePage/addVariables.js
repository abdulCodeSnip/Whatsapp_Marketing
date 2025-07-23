import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    variables: []
}
const addVariable = createSlice({
    name: "addVariable",
    initialState: initialState,
    reducers: {
        addingVariables: (state, action) => {
            const existingVariable = state.variables.find((myVariable) => myVariable?.id === action.payload?.id)
            if (!existingVariable) {
                state.variables.push(action.payload);
            }
        },
        removingVariables: (state, action) => {
            state.variables = state.variables.filter((myVariable) => myVariable?.id !== action?.payload?.id);
        }
    }
});

export const { addingVariables, removingVariables } = addVariable.actions;
export default addVariable.reducer;