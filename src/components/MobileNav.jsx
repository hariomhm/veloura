import { Link, useNavigate } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import { VscAccount } from "react-icons/vsc";
import { PiBagSimple } from "react-icons/pi";
import { useSelector } from "react-redux";
import ThemeBtn from "./ThemeBtn";

const MobileNav = () => {
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
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
      <div className="grid grid-cols-3 items-center">
        {/* MENU LINKS */}
        <div className="col-span-3 mb-4">
          <ul className="flex justify-between text-sm font-medium">
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
        <div className="col-span-1 text-lg logo-letter-spacing font-semibold">
          <Link to="/">VELOURA</Link>
        </div>

        {/* ACTIONS */}
        <div className="col-span-2 flex justify-end items-center gap-5">
          <ThemeBtn />

          <button aria-label="Search">
            <GoSearch size={20} />
          </button>

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
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;
