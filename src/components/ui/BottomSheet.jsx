import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  footer,
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
        flex items-end justify-center
        bg-black/50
      "
      onMouseDown={handleBackdropClick}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="
          flex max-h-[90dvh] w-full max-w-2xl
          flex-col overflow-hidden
          rounded-t-3xl bg-white shadow-2xl
        "
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        <header
          className="
            flex items-center justify-between gap-4
            border-b border-gray-200
            px-4 pb-4 sm:px-6
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
            aria-label="Cerrar panel"
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
              border-t border-gray-200
              bg-white px-4 py-4 sm:px-6
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

export default BottomSheet;