const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4",
};

function Loader({
  size = "md",
  label = "Cargando...",
  fullScreen = false,
  className = "",
}) {
  const loaderSize = sizeClasses[size] ?? sizeClasses.md;

  const content = (
    <div
      role="status"
      aria-live="polite"
      className={`
        flex items-center justify-center gap-3
        text-[#6F4E37]
        ${className}
      `}
    >
      <span
        aria-hidden="true"
        className={`
          animate-spin rounded-full
          border-current border-t-transparent
          ${loaderSize}
        `}
      />

      {label && (
        <span className="text-sm font-medium text-gray-600">
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

export default Loader;