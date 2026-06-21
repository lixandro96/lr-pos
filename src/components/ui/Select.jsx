function Select({
  id,
  label,
  options = [],
  placeholder = "Selecciona una opción",
  error,
  helperText,
  className = "",
  ...selectProps
}) {
  const descriptionId = error
    ? `${id}-error`
    : helperText
      ? `${id}-helper`
      : undefined;

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

      <div className="relative">
        <select
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className={`
            h-12 w-full appearance-none rounded-xl border
            bg-white px-3 pr-10 text-gray-900
            outline-none transition
            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-500
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            }
            ${className}
          `}
          {...selectProps}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="
            pointer-events-none absolute right-3 top-1/2
            h-5 w-5 -translate-y-1/2 text-gray-400
          "
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          className="text-sm text-red-600"
        >
          {error}
        </p>
      ) : (
        helperText && (
          <p
            id={`${id}-helper`}
            className="text-sm text-gray-500"
          >
            {helperText}
          </p>
        )
      )}
    </div>
  );
}

export default Select;