import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/themeSlice";

const ThemeBtn = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  return (
      <button
        onClick={() => dispatch(toggleTheme())}
        className="
        w-10 h-4 flex items-center rounded-full
        bg-slate-300 dark:bg-white-700
        transition-all duration-300
        p-1
      "
        aria-label="Toggle theme"
      >
        <div
          className={`
          w-3 h-3 rounded-full
          bg-white dark:bg-black
          transform transition-transform duration-300
          ${theme === "dark" ? "translate-x-5" : "translate-x-0"}
        `}
        />
      </button>
  );
};

export default ThemeBtn;
