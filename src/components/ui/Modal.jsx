import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
}) {
  const titleId = useId();
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousActiveElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const animationFrameId = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const modalSize = sizeClasses[size] ?? sizeClasses.md;

  function handleBackdropClick(event) {
    if (
      closeOnBackdrop &&
      event.target === event.currentTarget
    ) {
      onClose();
    }
  }

  return createPortal(
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/50 p-4
      "
      onMouseDown={handleBackdropClick}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`
          flex max-h-[calc(100vh-2rem)] w-full flex-col
          overflow-hidden rounded-2xl bg-white
          shadow-2xl
          ${modalSize}
        `}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header
          className="
            flex items-center justify-between gap-4
            border-b border-gray-200 px-4 py-4
            sm:px-6
          "
        >
          {title && (
            <h2
              id={titleId}
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>
          )}

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="
              ml-auto flex h-9 w-9 items-center
              justify-center rounded-full
              text-xl text-gray-500 transition
              hover:bg-gray-100 hover:text-gray-900
              focus:outline-none focus:ring-2
              focus:ring-[#6F4E37]/30
            "
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="overflow-y-auto px-4 py-5 sm:px-6">
          {children}
        </div>

        {footer && (
          <footer
            className="
              flex flex-col-reverse gap-3
              border-t border-gray-200
              px-4 py-4
              sm:flex-row sm:justify-end sm:px-6
            "
          >
            {footer}
          </footer>
        )}
      </section>
    </div>,
    document.body,
  );
}

export default Modal;