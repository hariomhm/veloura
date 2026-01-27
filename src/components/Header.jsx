import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import { VscAccount } from "react-icons/vsc";
import { PiBagSimple } from "react-icons/pi";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import ThemeBtn from "./ThemeBtn";

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.status);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const cartItemsCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const navMenus = [
    { name: "MEN'S", url: "/mens" },
    { name: "WOMEN'S", url: "/womens" },
    { name: "KID'S", url: "/kids" },
    { name: "SHOP ALL", url: "/products" },
  ];

  const handleAccountClick = () => {
    navigate(isAuthenticated ? "/profile" : "/login");
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-white dark:bg-slate-700 text-black dark:text-white shadow-md px-5 py-4 transition-colors duration-300">
      <div className="grid grid-cols-3 max-[880px]:grid-cols-2 items-center">
        {/* LEFT MENU (DESKTOP) */}
        <div className="hidden min-[880px]:block">
          <ul className="flex gap-6 text-sm font-medium">
            {navMenus.map((menu) => (
              <li key={menu.name}>
                <Link
                  to={menu.url}
                  className="hover:underline underline-offset-4"
                >
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* LOGO */}
        <div className="text-xl flex justify-center max-[880px]:justify-start logo-letter-spacing font-semibold">
          <Link to="/">VELOURA</Link>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex justify-end items-center gap-5">
          <div className="hidden min-[880px]:block">
            <ThemeBtn />
          </div>

          <button aria-label="Account" onClick={handleAccountClick}>
            <VscAccount size={20} />
          </button>

          <button
            aria-label="Cart"
            className="relative"
            onClick={() => navigate("/cart")}
          >
            <PiBagSimple size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="hidden min-[880px]:inline-block text-xs px-3 py-1 border rounded-md hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              Admin
            </button>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            className="min-[880px]:hidden border p-1 rounded-md border-black dark:border-white"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IoMdClose size={20} /> : <IoMdMenu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-700 shadow-md min-[880px]:hidden">
          <ul className="flex flex-col gap-4 p-5 text-center">
            {navMenus.map((menu) => (
              <li key={menu.name}>
                <Link
                  to={menu.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 font-medium"
                >
                  {menu.name}
                </Link>
              </li>
            ))}

            <li className="flex justify-center pt-2">
              <ThemeBtn />
            </li>

            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 font-medium text-red-500"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Header;
