function PageHeader({
  title,
  description,
  actions,
  className = "",
}) {
  return (
    <div
      className={`
        flex flex-col gap-4
        sm:flex-row sm:items-start sm:justify-between
        ${className}
      `}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 lg:hidden">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-gray-600 lg:mt-0">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;