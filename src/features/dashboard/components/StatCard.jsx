const toneClasses = {
  brown: {
    icon: "bg-[#6F4E37]/10 text-[#6F4E37]",
    value: "text-[#6F4E37]",
  },
  yellow: {
    icon: "bg-yellow-100 text-yellow-700",
    value: "text-yellow-700",
  },
  blue: {
    icon: "bg-blue-100 text-blue-700",
    value: "text-blue-700",
  },
  green: {
    icon: "bg-green-100 text-green-700",
    value: "text-green-700",
  },
  red: {
    icon: "bg-red-100 text-red-700",
    value: "text-red-700",
  },
};

function StatCard({
  title,
  value,
  description,
  icon,
  tone = "brown",
}) {
  const selectedTone = toneClasses[tone] ?? toneClasses.brown;

  return (
    <article
      className="
        rounded-2xl border border-gray-200
        bg-white p-5 shadow-sm
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p
            className={`
              mt-2 text-2xl font-bold
              ${selectedTone.value}
            `}
          >
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div
            aria-hidden="true"
            className={`
              flex h-11 w-11 shrink-0
              items-center justify-center rounded-xl
              ${selectedTone.icon}
            `}
          >
            {icon}
          </div>
        )}
      </div>
    </article>
  );
}

export default StatCard;