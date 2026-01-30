import React from "react";
import { Link } from "react-router-dom";
import banner from "../assets/bannerImage.png";
import mens from "../assets/mensbannerimage.png";
import womens from "../assets/womensbannerimage.png";
import kids from "../assets/kidsbannerimage.png";

const Home = () => {
  const banners = [
    { name: "Shop All", path: "/products", image: banner },
    { name: "Mens Collection", path: "/mens", image: mens },
    { name: "Womens Collection", path: "/womens", image: womens },
    { name: "Kids Collection", path: "/kids", image: kids },
  ];

  return (
<div className="min-h-screen">
  <div className="grid grid-cols-1">
{banners.map((banner, index) => (
  <Link
    key={banner.name}
    to={banner.path}
    className="block w-full h-screen overflow-hidden group"
    style={{
      animationDelay: `${index * 150}ms`,
    }}
  >
    <div
      className="relative w-full h-full bg-center bg-cover
                 scale-105
                 animate-fadeUp
                 transition-transform duration-700 ease-out
                 group-hover:scale-110"
      style={{ backgroundImage: `url("${banner.image}")` }}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />

      <h2
        className="absolute inset-0 flex items-center justify-center
                   text-white text-3xl font-bold
                   opacity-0 translate-y-6
                   transition-all duration-500
                   group-hover:opacity-100 group-hover:translate-y-0"
      >
        {banner.name}
      </h2>
    </div>
  </Link>
))}

  </div>
</div>

  );
};

export default Home;
