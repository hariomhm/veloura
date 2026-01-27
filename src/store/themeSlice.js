import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("theme") || "light";
};

const initialState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";

      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.mode);
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
