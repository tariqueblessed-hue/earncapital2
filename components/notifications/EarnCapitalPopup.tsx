"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type PopupType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "celebration";

type PopupData = {
  type: PopupType;
  title: string;
  message: string;
  buttonText?: string;
};

type PopupContextType = {
  showPopup: (
    type: PopupType,
    title: string,
    message: string,
    buttonText?: string
  ) => void;
  closePopup: () => void;
};

const PopupContext = createContext<PopupContextType | null>(null);

export function EarnCapitalPopupProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [popup, setPopup] = useState<PopupData | null>(null);

  function showPopup(
    type: PopupType,
    title: string,
    message: string,
    buttonText = "Continue"
  ) {
    setPopup({
      type,
      title,
      message,
      buttonText,
    });
  }

  function closePopup() {
    setPopup(null);
  }

  return (
    <PopupContext.Provider
      value={{
        showPopup,
        closePopup,
      }}
    >
      {children}

      {popup && (
        <div
          onClick={closePopup}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            background: "rgba(2,6,23,0.72)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "430px",
              background:
                "linear-gradient(145deg,#111827,#1e293b)",
              borderRadius: "28px",
              padding: "32px 26px",
              textAlign: "center",
              color: "white",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.55)",
              animation:
                "earnCapitalPopupIn .3s ease-out",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "82px",
                height: "82px",
                margin: "0 auto 18px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "42px",
                background:
                  popup.type === "success"
                    ? "rgba(34,197,94,0.15)"
                    : popup.type === "error"
                    ? "rgba(239,68,68,0.15)"
                    : popup.type === "warning"
                    ? "rgba(250,204,21,0.15)"
                    : popup.type === "celebration"
                    ? "rgba(168,85,247,0.18)"
                    : "rgba(59,130,246,0.15)",
              }}
            >
              {popup.type === "success" && "✅"}
              {popup.type === "error" && "❌"}
              {popup.type === "warning" && "⚠️"}
              {popup.type === "info" && "💡"}
              {popup.type === "celebration" && "🎉"}
            </div>

            {/* Celebration emojis */}
            {popup.type === "celebration" && (
              <div
                style={{
                  fontSize: "25px",
                  marginBottom: "8px",
                  letterSpacing: "8px",
                }}
              >
                🎊 ✨ 🏆
              </div>
            )}

            {/* Title */}
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "27px",
                fontWeight: "800",
                color: "#ffffff",
              }}
            >
              {popup.title}
            </h2>

            {/* Message */}
            <p
              style={{
                margin: "0 auto",
                maxWidth: "350px",
                color: "#cbd5e1",
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            >
              {popup.message}
            </p>

            {/* Button */}
            <button
              onClick={closePopup}
              style={{
                width: "100%",
                marginTop: "26px",
                padding: "15px",
                border: "none",
                borderRadius: "15px",
                background:
                  "linear-gradient(90deg,#2563eb,#7c3aed)",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "800",
                cursor: "pointer",
                boxShadow:
                  "0 10px 25px rgba(124,58,237,0.35)",
              }}
            >
              {popup.buttonText}
            </button>
          </div>

          <style jsx global>{`
            @keyframes earnCapitalPopupIn {
              from {
                opacity: 0;
                transform: translateY(25px) scale(0.94);
              }

              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>
        </div>
      )}
    </PopupContext.Provider>
  );
}

export function useEarnCapitalPopup() {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error(
      "useEarnCapitalPopup must be used inside EarnCapitalPopupProvider"
    );
  }

  return context;
}