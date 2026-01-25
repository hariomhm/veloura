import React from 'react';
import { FaBullseye, FaEye, FaHeart } from 'react-icons/fa';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Veloura</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your trusted partner for quality hardware and tools. We've been serving the community with reliable products and expert advice for over 20 years.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Who We Are</h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Veloura Hardware Store is a family-owned business dedicated to providing top-quality tools, hardware, and home improvement supplies.
            Our knowledgeable staff is here to help you find the right products for your projects, whether you're a DIY enthusiast or a professional tradesperson.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            We pride ourselves on our extensive inventory, competitive prices, and commitment to customer satisfaction.
            From power tools to plumbing supplies, we have everything you need under one roof.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Mission, Vision & Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <FaBullseye className="mx-auto text-4xl text-blue-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Mission</h3>
            <p className="text-gray-600 dark:text-gray-300">
              To provide high-quality hardware and tools that empower our customers to complete their projects successfully,
              while offering exceptional service and expertise.
            </p>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <FaEye className="mx-auto text-4xl text-green-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Vision</h3>
            <p className="text-gray-600 dark:text-gray-300">
              To be the leading hardware store in the region, known for our extensive selection,
              knowledgeable staff, and commitment to customer satisfaction.
            </p>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <FaHeart className="mx-auto text-4xl text-red-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Values</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Quality, Integrity, Customer Service, Community Involvement.
              We believe in building lasting relationships with our customers through trust and reliability.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Visit Our Store</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg flex items-center justify-center mb-6">
            <p className="text-gray-500 dark:text-gray-400">Store Location Map Placeholder</p>
            {/* Replace with actual map embed, e.g., Google Maps iframe */}
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Veloura Hardware Store</h3>
            <p className="text-gray-600 dark:text-gray-300">123 Main Street, Anytown, USA 12345</p>
            <p className="text-gray-600 dark:text-gray-300">Phone: (555) 123-4567</p>
            <p className="text-gray-600 dark:text-gray-300">Email: info@veloura.com</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
