import React from "react";
import data from "../../data/portfolio.json";

// Styling is driven by Tailwind's `dark:` variants (the `.dark` class next-themes
// puts on <html>) rather than by reading the theme in JS. `useTheme().theme` is
// "system" until the user picks a theme explicitly, which made every
// `theme === "dark"` check fall through to the light branch while the page was
// actually rendering dark.
const Button = ({ children, type, onClick, classes, social = "none" }) => {
  const base =
    "text-sm tablet:text-base p-1 laptop:p-2 m-1 laptop:m-2 rounded-control transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-black link";

  const variant =
    type === "primary" || type === "social"
      ? "first:ml-0 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
      : "flex items-center tablet:first:ml-0 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800";

  const className = [base, variant, data.showCursor && "cursor-none", classes]
    .filter(Boolean)
    .join(" ");

  return (
    <button onClick={onClick} type="button" className={className}>
      {children}
    </button>
  );
};

export default Button;
