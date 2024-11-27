import React, { useEffect, useState } from "react";
import {
  useAppKitState,
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
} from "@reown/appkit/react";
import ConnectButton from "../buttons/ConnectButton";
type Props = {
  title: string;
  icon: string;
  onCallback: (
    isConnected: boolean,
    selectedNetworkId: string | undefined,
    address: string,
    status: string
  ) => void;
};

const WalletConnectModal: React.FC<Props> = ({ title, icon, onCallback }) => {
  const { open } = useAppKit();
  const { selectedNetworkId } = useAppKitState();
  const { address, isConnected, caipAddress, status } = useAppKitAccount();
  const { switchNetwork } = useAppKitNetwork();

  const connect = () => {
    open({ view: "Connect" });
  };
  useEffect(() => {
    const setupProvider = () => {
      onCallback(isConnected, selectedNetworkId, address, status);
    };
    setupProvider();
  }, [selectedNetworkId, onCallback, address, isConnected, status]);
  return (
    <>
      <ConnectButton title={title} icon={icon} callback={connect} />
    </>
  );
};

export default WalletConnectModal;
