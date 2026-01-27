import Skeleton from "./Skeleton";

const Loading = ({
  message = "Loading...",
  type = "spinner",
  count = 6,
}) => {
  if (type === "skeleton") {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-busy="true"
        aria-live="polite"
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <Skeleton className="w-full h-48" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center py-12"
      role="status"
      aria-live="polite"
    >
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-transparent"></div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        {message}
      </p>
    </div>
  );
};

export default Loading;
