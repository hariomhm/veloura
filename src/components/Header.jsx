import React from "react";
import ThemeBtn from "./ThemeBtn";
import { Link, useNavigate } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import { VscAccount } from "react-icons/vsc";
import { PiBagSimple } from "react-icons/pi";
import { IoMdMenu } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { account } from "../lib/appwrite";


const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.status);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const cartItemsCount = useSelector((state) => state.cart.items.reduce((total, item) => total + item.quantity, 0));

  const handleAccountClick = async () => {
    if (isAuthenticated) {
      try {
        await account.deleteSession('current');
        dispatch(logout());
      } catch (error) {
        console.error('Logout failed:', error);
      }
    } else {
      navigate('/login');
    }
  };

  const navMenus = [
    {
      name: "MEN'S",
      url: "/products",
    },
    {
      name: "WOMEN'S",
      url: "/products",
    },
    {
      name: "KID'S",
      url: "/products",
    },
    {
      name: "SHOP ALL",
      url: "/products",
    },
  ];
  return (
    <nav className="w-full text-black sticky top-0 dark:text-white dark:bg-slate-700 shadow-md px-5 py-4 grid grid-cols-3 max-[880px]:grid-cols-2 duration-500">
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
          <div className="flex gap-2">
            <button onClick={() => navigate('/admin/add-product')} className="text-sm">Add Product</button>
            <button onClick={() => navigate('/admin/manage-orders')} className="text-sm">Manage Orders</button>
          </div>
        )}
        <div className="cursor-pointer border p-1 min-[880px]:hidden border-black dark:border-white">
          <IoMdMenu size={20} />
        </div>
      </div>
    </nav>
    
  );
};

export default Header;
