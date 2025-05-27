import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  userId: "682ab4ec966b9a9ce9529935",
  token: null, // Store JWT token here
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const { setMode, setToken, setUserId } = globalSlice.actions;

export default globalSlice.reducer;