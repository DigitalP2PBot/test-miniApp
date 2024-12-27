import React from "react";

type Props = {
  title: string;
  className?: string;
  callback: () => void;
};

const GhostButton: React.FC<Props> = ({
  title,
  className = "",
  callback,
}) => {
  return (
    <button
      className={`flex p-4 text-sm hover:underline hover:text-orangePeel justify-center ${className}`}
      onClick={callback}
    >
      {title}
    </button>
  );
};

export default GhostButton;
