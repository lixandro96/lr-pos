function SearchInput({
  id,
  label,
  value,
  onChange,
  onClear,
  placeholder = "Buscar...",
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

      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="
            pointer-events-none absolute left-3 top-1/2
            h-5 w-5 -translate-y-1/2 text-gray-400
          "
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          id={id}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            h-12 w-full rounded-xl border border-gray-300
            bg-white py-2 pl-10 pr-10
            text-gray-900 placeholder:text-gray-400
            outline-none transition
            focus:border-[#6F4E37]
            focus:ring-2 focus:ring-[#6F4E37]/20
            ${className}
          `}
          {...inputProps}
        />

        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpiar búsqueda"
            className="
              absolute right-2 top-1/2
              flex h-8 w-8 -translate-y-1/2
              items-center justify-center rounded-full
              text-gray-500 transition
              hover:bg-gray-100 hover:text-gray-800
            "
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchInput;