import { FaBullseye, FaEye, FaHeart } from "react-icons/fa";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-4">About Veloura</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Veloura is a modern fashion brand crafted for confidence, comfort,
          and timeless style. From everyday essentials to statement outfits,
          we design fashion that moves with you.
        </p>
      </section>

      {/* Who We Are */}
      <section className="mb-14">
        <h2 className="text-3xl font-bold text-center mb-8">Who We Are</h2>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Veloura was born from a passion for clean design, premium fabrics,
            and affordable luxury. We believe fashion should feel as good as it
            looks—without compromising on quality.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Our collections for Men, Women, and Kids are thoughtfully designed
            to blend trend and timelessness, ensuring every piece earns a place
            in your wardrobe.
          </p>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="mb-14">
        <h2 className="text-3xl font-bold text-center mb-10">
          Our Mission, Vision & Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <FaBullseye className="mx-auto text-4xl text-blue-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Mission</h3>
            <p className="text-gray-600 dark:text-gray-300">
              To deliver stylish, high-quality fashion that empowers individuals
              to express themselves with confidence every day.
            </p>
          </div>

          {/* Vision */}
          <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <FaEye className="mx-auto text-4xl text-green-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Vision</h3>
            <p className="text-gray-600 dark:text-gray-300">
              To become a trusted global fashion destination known for design,
              quality, and a seamless shopping experience.
            </p>
          </div>

          {/* Values */}
          <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <FaHeart className="mx-auto text-4xl text-red-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Values</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Quality craftsmanship, honest pricing, inclusivity, and a deep
              respect for our customers and community.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Note */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">Why Veloura?</h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-700 dark:text-gray-300">
          Because fashion isn’t just about clothing—it’s about how you feel.
          At Veloura, every piece is designed to elevate your everyday style
          while keeping comfort at the core.
        </p>
      </section>
    </div>
  );
};

export default About;
