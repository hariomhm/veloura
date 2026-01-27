import { FaExclamationTriangle } from "react-icons/fa";

const Error = ({
  message = "Something went wrong. Please try again.",
  onRetry,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-12 px-4"
      role="alert"
      aria-live="assertive"
    >
      <FaExclamationTriangle
        className="text-red-500 text-5xl mb-4"
        aria-hidden="true"
      />

      <p className="text-red-500 text-base sm:text-lg mb-6">
        {message}
      </p>

      {typeof onRetry === "function" && (
        <button
          onClick={onRetry}
          className="bg-red-500 text-white px-5 py-2.5 rounded-md font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;
