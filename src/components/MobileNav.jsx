import React from "react";
import ThemeBtn from "./ThemeBtn";
import { Link, useNavigate } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import { VscAccount } from "react-icons/vsc";
import { PiBagSimple } from "react-icons/pi";

const MobileNav = () => {
  const navigate = useNavigate();

  const navMenus = [
    {
      name: "MEN'S",
      url: "/mens-wears",
    },
    {
      name: "WOMEN'S",
      url: "/womens-wear",
    },
    {
      name: "KID'S",
      url: "/kids-wear",
    },
    {
      name: "SHOP ALL",
      url: "/shop-all",
    },
  ];
  return (
    <nav className="w-full text-black sticky top-0 dark:text-white dark:bg-slate-700 shadow-md px-5 py-4 grid grid-cols-3 max-[880px]:grid-cols-2">
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
        <div className="cursor-pointer">
          <ThemeBtn />
        </div>
        <div className="cursor-pointer">
          <GoSearch size={20} />
        </div>
        <div className="cursor-pointer">
          <VscAccount size={20} />
        </div>
        <div className="cursor-pointer">
          <PiBagSimple size={20} />
        </div>
      </div>
    </nav>
    
  );
};

export default MobileNav;
