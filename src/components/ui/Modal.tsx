"use client";
import { useEffect, useCallback, useRef, Fragment } from "react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen:     boolean;
  onClose:    () => void;
  title?:     string;
  children:   React.ReactNode;
  size?:      "sm" | "md" | "lg" | "xl";
  hideClose?: boolean;
  footer?:    React.ReactNode;
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export function Modal({ isOpen, onClose, title, children, size = "md", hideClose, footer }: ModalProps) {
  const dialogRef   = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }

      // Trap focus inside modal
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    // Set initial focus on close button or first focusable element
    const id = setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      clearTimeout(id);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          className={cn(
            "relative w-full rounded-2xl bg-white shadow-2xl",
            sizeStyles[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || !hideClose) && (
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              {title && (
                <h2 id="modal-title" className="text-base font-semibold text-slate-800">
                  {title}
                </h2>
              )}
              {!hideClose && (
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={onClose}
                  className="ml-auto rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  aria-label="Close dialog"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-5">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
