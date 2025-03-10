import React from "react";

type Props = {
  title: string;
  className?: string;
  textColor?: string;
  callback: () => void;
};

const PrimaryButton: React.FC<Props> = ({
  title,
  className,
  textColor = "white",
  callback,
}) => {
  return (
    <button
      className={`flex items-center justify-center bg-oceanGreen w-full h-12 text-${textColor} py-3 px-5 rounded-lg border-oceanGreen border-1 text-base font-semibold text-center ${className} active:bg-oceanGreen-400`}
      onClick={callback}
    >
      <span>{title}</span>
    </button>
  );
};

export default PrimaryButton;
