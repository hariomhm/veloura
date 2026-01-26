import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const banners = [
  {
    image: '/bannerImage.png',
    title: 'Welcome to Veloura',
    text: 'Trendy fashion for Men, Women & Kids — style that fits every moment.',
    link: '/products',
    linkText: 'Shop All'
  },
  {
    image: '/mensbannerimage.png',
    title: 'Men\'s Collection',
    text: 'Bold styles designed for modern men.',
    link: '/mens',
    linkText: "Men's Collection"
  },
  {
    image: '/womensbannerimage.png',
    title: 'Women\'s Collection',
    text: 'Elegant fashion that defines confidence.',
    link: '/womens',
    linkText: "Women's Collection"
  },
  {
    image: '/kidsbannerimage.png',
    title: 'Kids\' Collection',
    text: 'Comfortable, playful & trendy styles for kids.',
    link: '/kids',
    linkText: "Kids' Collection"
  }
];

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Auto-play every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const currentBanner = banners[currentIndex];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${currentBanner.image})` }}
      ></div>
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4 tracking-wide">
          {currentBanner.title}
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {currentBanner.text}
        </p>
        <Link
          to={currentBanner.link}
          className="inline-block bg-white text-black py-3 px-10 rounded-full font-semibold text-lg hover:bg-gray-200 transition"
        >
          {currentBanner.linkText}
        </Link>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition"
      >
        <FaChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition"
      >
        <FaChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default BannerCarousel;
