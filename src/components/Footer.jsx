import React from "react";
import {
  FaInstagramSquare,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "About us", url: "/about" },
      { name: "Help", url: "/help" },
      { name: "Terms & Conditions", url: "/terms" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { name: "My Account", url: "/account" },
      { name: "Order Tracking", url: "/order-tracking" },
      { name: "Returns & Exchange", url: "/returns" },
    ],
  },
];

const socialLinks = [
  {
    icon: FaInstagramSquare,
    label: "Instagram",
    url: "https://instagram.com/veloura",
  },
  {
    icon: FaFacebook,
    label: "Facebook",
    url: "https://facebook.com/veloura",
  },
  {
    icon: FaYoutube,
    label: "YouTube",
    url: "https://youtube.com/@veloura",
  },
  {
    icon: FaXTwitter,
    label: "Twitter (X)",
    url: "https://x.com/veloura",
  },
];

const Footer = () => {
  return (
    <footer className="w-full px-10 py-6 text-[#2f2f2f] dark:text-white dark:bg-slate-700 duration-5-00">
      <div className="flex flex-row-reverse max-md:flex-col gap-10">
        
        <div className="flex flex-1 gap-6 max-md:justify-between">
          {footerLinks.map(({ title, links }) => (
            <div key={title} className="max-w-52 w-full">
              <h2 className="font-bold mb-3">{title}</h2>
              <ul className="space-y-1">
                {links.map(({ name, url }) => (
                  <li key={name}>
                    <a
                      href={url}
                      className="hover:underline transition"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center md:items-start w-2/12 max-md:w-full">
          <h2 className="font-bold mb-3 hidden md:block">Follow Us</h2>
          <ul className="flex gap-4 max-md:justify-center w-full">
            {socialLinks.map(({ icon, label, url }) => (
              <li key={label}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hover:scale-110 transition-transform"
                >
                  {React.createElement(icon, { size: 20 })}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 text-sm text-slate-500">
        All Rights Reserved | © 2026{" "}
        <span className="logo-letter-spacing">VELOURA</span>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
