import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const Error = ({ message = "An error occurred.", onRetry }) => {
  return (
    <div className="text-center py-10">
      <FaExclamationTriangle className="mx-auto text-red-500 text-6xl mb-4" />
      <p className="text-red-500 text-lg mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;
