// components/BannerSection.jsx
import { Link } from "react-router-dom";

const BannerSection = ({
  bgImage,
  title,
  description,
  buttonText,
  linkTo,
  showImage = false,
  imageSrc = "",
}) => {
  return (
    <section
      className="relative h-screen flex items-center justify-center"
      style={{
        backgroundImage: bgImage ? `url('${bgImage}')` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 text-center text-white px-4">
        {showImage && (
          <img
            src={imageSrc}
            alt="banner"
            className="mx-auto mb-6 max-w-full"
          />
        )}

        <h1 className="text-5xl font-bold mb-4 tracking-wide">
          {title}
        </h1>

        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {description}
        </p>

        <Link
          to={linkTo}
          className="inline-block bg-white text-black py-3 px-10 rounded-full font-semibold text-lg hover:bg-gray-200 transition"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
};

export default BannerSection;
