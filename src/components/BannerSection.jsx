// components/BannerSection.jsx
import { Link } from "react-router-dom";

const BannerSection = ({
  bgImage = "",
  title = "",
  description = "",
  buttonText = "Shop Now",
  linkTo = "/",
  showImage = false,
  imageSrc = "",
  imageAlt = "Banner image",
}) => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-center bg-cover"
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-3xl">
        {showImage && imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="mx-auto mb-6 max-h-40 object-contain"
            loading="lazy"
          />
        )}

        {title && (
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-wide">
            {title}
          </h1>
        )}

        {description && (
          <p className="text-base sm:text-lg md:text-xl mb-8">
            {description}
          </p>
        )}

        {buttonText && (
          <Link
            to={linkTo}
            className="inline-block bg-white text-black py-3 px-10 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-200 transition-colors duration-200"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default BannerSection;
