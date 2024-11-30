import React, { useEffect } from "react";
import {
  useAppKitState,
  useAppKit,
  useAppKitAccount,
} from "@reown/appkit/react";
import { AccountControllerState } from "@reown/appkit-core";

import ConnectButton from "../buttons/ConnectButton";
type Props = {
  title: string;
  icon: string;
  onCallback: (
    isConnected: boolean,
    status: AccountControllerState["status"],
    address?: string
  ) => void;
};

const WalletConnectModal: React.FC<Props> = ({ title, icon, onCallback }) => {
  const { open } = useAppKit();
  const { selectedNetworkId } = useAppKitState();
  const { address, isConnected, status } = useAppKitAccount();
  //const { address, isConnected, caipAddress, status } = useAppKitAccount();
  //const { switchNetwork } = useAppKitNetwork();

  const connect = async () => {
    open({ view: "Connect" });
  };
  useEffect(() => {
    const setupProvider = () => {
      onCallback(isConnected, status, address);
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
