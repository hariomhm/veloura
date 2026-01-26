import React, { useState } from "react";
import ThemeBtn from "./ThemeBtn";
import { Link, useNavigate } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import { VscAccount } from "react-icons/vsc";
import { PiBagSimple } from "react-icons/pi";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { account } from "../lib/appwrite";


const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.status);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const cartItemsCount = useSelector((state) => state.cart.items.reduce((total, item) => total + item.quantity, 0));
  const theme = useSelector((state) => state.theme.mode);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const navMenus = [
    {
      name: "MEN'S",
      url: "/mens",
    },
    {
      name: "WOMEN'S",
      url: "/womens",
    },
    {
      name: "KID'S",
      url: "/kids",
    },
    {
      name: "SHOP ALL",
      url: "/products",
    },
  ];
  return (
    <nav className="w-full text-black sticky top-0 dark:text-white dark:bg-slate-700 shadow-md px-5 py-6 grid grid-cols-3 max-[880px]:grid-cols-2 duration-500">
      <div className="w-full max-[880px]:hidden ">
        <ul className="w-full flex gap-5">
          {navMenus.map((menu) => {
            return (
              <li
                key={menu.name}
                onClick={() => navigate(menu.url)}
                className="cursor-pointer text-nowrap"
              >
                {menu.name}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="w-full text-xl flex justify-center max-[880px]:inline-block logo-letter-spacing font-semibold">
        <Link to="/">VELOURA</Link>
      </div>

      <div className="w-full flex justify-end items-center gap-5">
        <div className="cursor-pointer max-[880px]:hidden ">
          <ThemeBtn />
        </div>
        <div className="cursor-pointer">
          <GoSearch size={20} />
        </div>
        <div className="cursor-pointer" onClick={handleAccountClick}>
          <VscAccount size={20} />
        </div>
        <div className="cursor-pointer relative" onClick={() => navigate('/cart')}>
          <PiBagSimple size={20} />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </div>
        {isAdmin && (
          <button onClick={() => navigate('/admin')} className="text-sm">Admin Dashboard</button>
        )}
        <div className="cursor-pointer border p-1 min-[880px]:hidden border-black dark:border-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <IoMdClose size={20} /> : <IoMdMenu size={20} />}
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-700 shadow-md min-[880px]:hidden">
          <ul className="flex flex-col gap-4 p-4">
            {navMenus.map((menu) => (
              <li
                key={menu.name}
                onClick={() => {
                  navigate(menu.url);
                  setMobileMenuOpen(false);
                }}
                className="cursor-pointer text-nowrap"
              >
                {menu.name}
              </li>
            ))}
            <li className="flex justify-center">
              <ThemeBtn />
            </li>
          </ul>
        </div>
      )}
    </nav>

  );
};

export default Header;
