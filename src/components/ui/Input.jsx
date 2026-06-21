function Input({
  id,
  label,
  error,
  className = "",
  ...inputProps
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
          h-12 w-full rounded-xl border bg-white px-3
          text-gray-900 placeholder:text-gray-400
          outline-none transition
          focus:ring-2
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-[#6F4E37] focus:ring-[#6F4E37]/20"
          }
          ${className}
        `}
        {...inputProps}
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;