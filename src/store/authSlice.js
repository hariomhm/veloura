import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
  isAdmin: false,
  banned: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const user = action.payload.userData;

      state.status = true;
      state.userData = user;

      // ✅ ROLE & FLAGS SHOULD COME FROM BACKEND
      state.isAdmin = user?.prefs?.role === "admin";
      state.banned = user?.prefs?.banned === true;
    },

    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.isAdmin = false;
      state.banned = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
