import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/themeSlice";

const ThemeBtn = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      aria-label="Toggle theme"
      className="
        relative w-10 h-5 flex items-center
        rounded-full
        bg-slate-300 dark:bg-slate-600
        transition-colors duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-slate-400 dark:focus:ring-slate-500
      "
    >
      <span
        className={`
          absolute left-1
          w-3.5 h-3.5 rounded-full
          bg-white dark:bg-black
          transform transition-transform duration-300
          ${theme === "dark" ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
};

export default ThemeBtn;
