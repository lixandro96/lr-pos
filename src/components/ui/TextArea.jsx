function TextArea({
  id,
  label,
  error,
  helperText,
  className = "",
  rows = 4,
  ...textareaProps
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

      <textarea
        id={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={`
          min-h-28 w-full resize-y rounded-xl border bg-white px-3 py-2.5
          text-gray-900 placeholder:text-gray-400
          outline-none transition
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          }
          ${className}
        `}
        {...textareaProps}
      />

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

export default TextArea;
