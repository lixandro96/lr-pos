import { useId } from "react";

function EmptyState({
  icon,
  title = "No hay información",
  description,
  action,
  className = "",
}) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      className={`
        flex min-h-64 flex-col items-center justify-center
        rounded-2xl border border-dashed border-gray-300
        bg-white px-6 py-10 text-center
        ${className}
      `}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="
            mb-4 flex h-14 w-14 items-center
            justify-center rounded-full
            bg-[#6F4E37]/10 text-[#6F4E37]
          "
        >
          {icon}
        </div>
      )}

      {title && (
        <h2
          id={titleId}
          className="text-lg font-semibold text-gray-900"
        >
          {title}
        </h2>
      )}

      {description && (
        <p
          id={descriptionId}
          className="mt-2 max-w-md text-sm leading-6 text-gray-500"
        >
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </section>
  );
}

export default EmptyState;