const FilterDrawer = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40"
      onClick={onClose}
    >
      <div
        className="absolute left-0 top-0 h-full w-80 bg-white p-4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default FilterDrawer;
