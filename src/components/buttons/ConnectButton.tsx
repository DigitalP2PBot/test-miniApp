import React from "react";

type Props = {
  title: string;
  callback: () => void;
};

const ConnectButton: React.FC<Props> = ({ title, callback }) => {
  return (
    <button
      className="flex items-center justify-center bg-oceanGreen active:bg-oceanGreen-400 text-white py-3 px-5 rounded-xl border-none text-base font-semibold whitespace-nowrap"
      onClick={callback}
    >
      <span className="flex-grow text-center -ml-9">{title}</span>
    </button>
  );
};

export default ConnectButton;
