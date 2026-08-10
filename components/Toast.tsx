"use client";

import { useEffect } from "react";

type ToastType = "success" | "error" | "warning" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  onClose: () => void;
};

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: "✓",
    error: "✕",
    warning: "!",
    info: "i",
  };

  const titles = {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
  };

  const styles = {
    success: {
      border: "border-green-500",
      icon: "bg-green-500",
    },
    error: {
      border: "border-red-500",
      icon: "bg-red-500",
    },
    warning: {
      border: "border-yellow-500",
      icon: "bg-yellow-500",
    },
    info: {
      border: "border-blue-500",
      icon: "bg-blue-500",
    },
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] w-[calc(100%-2rem)] max-w-sm">
      <div
        className={`flex items-start gap-3 rounded-xl border-l-4 bg-white p-4 shadow-2xl ${styles[type].border}`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${styles[type].icon}`}
        >
          {icons[type]}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900">{titles[type]}</p>
          <p className="mt-1 text-sm text-gray-600">{message}</p>
        </div>

        <button
          onClick={onClose}
          className="text-lg leading-none text-gray-400 hover:text-gray-700"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}