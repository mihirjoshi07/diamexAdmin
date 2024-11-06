// src/features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isUser: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state) => {
            state.isUser = !state.isUser; // Toggles the isUser state
        },
    },
});

// Export actions for use in components
export const { setUser } = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;
