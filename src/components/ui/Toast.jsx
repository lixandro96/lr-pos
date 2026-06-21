import { useEffect } from "react";
import { createPortal } from "react-dom";

const toastVariants = {
  success: {
    symbol: "✓",
    container: "border-green-200 bg-green-50",
    icon: "bg-green-100 text-green-700",
    title: "text-green-900",
    message: "text-green-800",
  },

  error: {
    symbol: "!",
    container: "border-red-200 bg-red-50",
    icon: "bg-red-100 text-red-700",
    title: "text-red-900",
    message: "text-red-800",
  },

  warning: {
    symbol: "!",
    container: "border-yellow-200 bg-yellow-50",
    icon: "bg-yellow-100 text-yellow-700",
    title: "text-yellow-900",
    message: "text-yellow-800",
  },

  info: {
    symbol: "i",
    container: "border-blue-200 bg-blue-50",
    icon: "bg-blue-100 text-blue-700",
    title: "text-blue-900",
    message: "text-blue-800",
  },
};

function Toast({
  isOpen,
  onClose,
  type = "success",
  title,
  message,
  duration = 3500,
}) {
  const variant = toastVariants[type] ?? toastVariants.info;

  useEffect(() => {
    if (!isOpen || duration <= 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen, duration, onClose]);

  if (!isOpen) {
    return null;
  }

  const role =
    type === "error" || type === "warning"
      ? "alert"
      : "status";

  return createPortal(
    <div
      className="
        fixed left-1/2
        top-[calc(1rem+env(safe-area-inset-top))]
        z-[120]
        w-[calc(100%-2rem)] max-w-sm
        -translate-x-1/2
        sm:left-auto sm:right-4 sm:translate-x-0
      "
    >
      <div
        role={role}
        aria-live={role === "alert" ? "assertive" : "polite"}
        className={`
          flex items-start gap-3
          rounded-2xl border p-4
          shadow-lg
          ${variant.container}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            flex h-8 w-8 shrink-0
            items-center justify-center
            rounded-full text-sm font-bold
            ${variant.icon}
          `}
        >
          {variant.symbol}
        </span>

        <div className="min-w-0 flex-1">
          {title && (
            <p className={`font-semibold ${variant.title}`}>
              {title}
            </p>
          )}

          {message && (
            <p
              className={`
                text-sm leading-5
                ${title ? "mt-1" : ""}
                ${variant.message}
              `}
            >
              {message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar notificación"
          className="
            flex h-8 w-8 shrink-0
            items-center justify-center
            rounded-full text-xl
            text-gray-500 transition
            hover:bg-black/5 hover:text-gray-800
            focus:outline-none focus:ring-2
            focus:ring-[#6F4E37]/30
          "
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default Toast;