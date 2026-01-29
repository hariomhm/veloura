import { memo } from "react";

const Skeleton = memo(({
  className = "",
  variant = "rectangular",
  width,
  height
}) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";

  const variants = {
    rectangular: "",
    circular: "rounded-full",
    text: "rounded",
  };

  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={style}
    />
  );
});

Skeleton.displayName = "Skeleton";
export default Skeleton;
