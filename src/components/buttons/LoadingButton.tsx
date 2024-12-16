import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  title: string;
  className?: string;
  textColor?: string;
  callback: () => void;
  isLoading?: boolean; // New prop to handle loading state
  disabled?: boolean; // New prop to handle disabled state
};

const LoadingButton: React.FC<Props> = ({
  title,
  className = "",
  textColor = "white",
  isLoading = false,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className={`flex items-center justify-center bg-oceanGreen w-full h-12 text-${textColor} py-3 px-5 rounded-lg border-oceanGreen border text-base font-semibold text-center ${className} ${
        disabled || isLoading
          ? "opacity-50 cursor-not-allowed"
          : "active:bg-blue-400"
      }`}
      disabled={disabled || isLoading}
    >
      {isLoading && (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-3 text-current"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C3.4 0 0 5.4 0 12h4zm2 5.3l2.8 2.8A8 8 0 0112 20v-4c-2.2 0-4.2-1-5.7-2.7z"
            />
          </svg>
          <span>{title}</span>
        </>
      )}
    </button>
  );
};

export default LoadingButton;
