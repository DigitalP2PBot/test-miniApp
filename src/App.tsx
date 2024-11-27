import { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import axios from "axios";
import { AppDispatch, RootState } from "./redux/store";

import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useDisconnect, useAppKitProvider } from "@reown/appkit/react";
import Avatar from "./components/utils/Avatar";
import BackButton from "./components/buttons/BackButton";
import SkipButton from "./components/buttons/SkipButton";
import PrimaryButton from "./components/buttons/PrimaryButton";
import Tooltip from "./components/utils/Tooltip";
import TransactionButton from "./components/buttons/TransactionButton";
import TransactionHistoryItem from "./components/utils/TransactionHistoryItem";
import ConnectOverlay from "./components/connectOverlay/ConnectOverlay";

import evmConnectIcon from "./assets/EVM_connect_logos.png";
import walletConnectIcon from "./assets/wallet_connect.png";
import etherIcon from "./assets/ether_icon.png";
import polygonIcon from "./assets/polygon_logo.svg";
import sendIcon from "./assets/send_icon.svg";
import receiveIcon from "./assets/receive_icon.svg";
import sellIcon from "./assets/sell_icon.svg";
import WalletConnectModal from "./components/connectors/WalletConnectModal";
import { useDispatch, useSelector } from "react-redux";
import { setConnectionState } from "./redux/connectionSlice";
import { ethers } from "ethers";

enum View {
  LANDING = 0,
  CONNECT = 1,
  CONNECTED = 2,
  WALLET = 3,
}

enum walletConnectionState {
  DISCONNECTED = "disconnected",
  CONNECTED = "connected",
}
const digitalP2PExchangeAddress = import.meta.env
  .VITE_DIGITALP2P_POLYGON_SM_ADDRESS;

const polygonUsdtAddress = import.meta.env.VITE_POLYGON_USDT_ADDRESS;

const USDTAbi = [
  "function approve(address spender, uint256 value) view returns (bool)",
];

const digitalP2PExchangeAbi = [
  "function processOrder(string _orderId, uint256 userUsdtAmountSent,uint256 orderUsdtAmount)",
];
WebApp.setHeaderColor("#1a1a1a");
function App() {
  const { walletProvider } = useAppKitProvider("eip155");
  const { disconnect } = useDisconnect();
  const [view, setView] = useState<View>(View.CONNECT);
  const [userWalletAddress, setWalletAddress] = useState<string>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>(null);

  // Connection State
  const connectionState = useSelector(
    (state: RootState) => state.connection.connectionState
  );

  const dispatch = useDispatch<AppDispatch>();

  const skip = () => {
    setView(view + 1);
  };
  const goBack = () => {
    if (view === View.LANDING) {
      return;
    }
    setView(view - 1);
  };

  const openWallet = () => {
    setView(View.WALLET);
  };
  const approveTransaction = async () => {
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const usdtContract = new Contract(polygonUsdtAddress, USDTAbi, signer);
    const digitalP2PCanMoveFunds = await usdtContract.approve(
      digitalP2PExchangeAddress,
      3
    );
    if (digitalP2PCanMoveFunds) {
      const digitalP2PExchangeContract = new Contract(
        digitalP2PExchangeAddress,
        digitalP2PExchangeAbi,
        signer
      );
      await digitalP2PExchangeContract.processOrder(
        "e09d4c41-20ee-4414-8cb4-73ba257ec96b",
        2320000,
        2320000
      );
    }
  };

  // Get Accounts
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const getAccountData = async () => {
    const providerId = window.localStorage.getItem("providerId");
  };

  const handleConnect = (
    isConnected: boolean,
    selectedNetworkId: string | undefined,
    address: string,
    status: string
  ) => {
    if (isConnected) {
      dispatch(setConnectionState(walletConnectionState.CONNECTED));
      setView(View.CONNECTED);
    } else {
      dispatch(setConnectionState(walletConnectionState.DISCONNECTED));
      setView(View.CONNECT);
    }
    setWalletAddress(address);
    setConnectionStatus(status);
  };

  // Handle MainButton changes on view change
  useEffect(() => {
    if (view === View.LANDING) {
    }
    // Change the Main Buttons color and textColor to match telegrams background color, to "hide" the button
    if (view === View.CONNECT) {
    }
    if (view === View.CONNECTED) {
      getAccountData();
    }
    if (view === View.WALLET) {
    }
  }, [view]);

  useEffect(() => {
    //console.log("connectionState", connectionState);
    if (connectionState === walletConnectionState.CONNECTED) {
      setView(View.CONNECTED);
    } else if (connectionState === walletConnectionState.DISCONNECTED) {
      setView(View.CONNECT);
    }
  }, [connectionState, walletConnectionState]);

  // Test Functions
  const [signedMessage, setSignedMessage] = useState<string | null>(null);
  const triggerTestMessageSign = () => {
    const providerId = window.localStorage.getItem("providerId");
    const uri = window.localStorage.getItem("walletConnectURI");
    if (wallet === "metamask") {
      WebApp.openLink(`https://metamask.app.link/wc?uri=${uri}`);
    } else if (wallet === "trust") {
      WebApp.openLink(`https://link.trustwallet.com/wc?uri=${uri}`);
    }
  };

  // Disconnect
  const handleDisconnect = async () => {
    await disconnect();
    dispatch(setConnectionState(walletConnectionState.DISCONNECTED));
  };

  return (
    <div className="flex flex-col h-full min-h-screen w-screen rounded-xl bg-customGrayWallet">
      <div className="flex flex-col flex-grow min-h-full justify-end">
        <div className="components-container mb-2">
          <div className="flex flex-col bg-white pt-4 pr-8 pb-8 pl-8 gap-4 rounded-t-3xl rounded-b-xl shadow-custom-white">
            <div>
              <h2 className="headline">DigitalP2P Exchange</h2>
            </div>
            <div>
              <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                Order Summary
              </p>
              {connectionStatus === walletConnectionState.CONNECTED && (
                <>
                  <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                    Connection status: {connectionStatus}
                  </p>
                  <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                    Your Wallet Address: {userWalletAddress}
                  </p>
                </>
              )}
              <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                Se van a transferir 3.3 usdt de tu wallet a nuestro contrato
                inteligente. Si el valor mostrado es manipulado la orden sera
                congelado.
              </p>
            </div>
          </div>
          {view === View.CONNECTED && (
            <>
              <PrimaryButton
                title="Approve transaction"
                callback={approveTransaction}
              />
            </>
          )}
        </div>
      </div>
      {view === View.CONNECT && (
        <div className="components-container">
          <div className={`transition-opacity duration-1000 ease-in-out`}>
            <div className="flex flex-col absolute w-full bottom-0 bg-white pt-4 px-8 pb-14 gap-4 rounded-t-3xl rounded-b-xl shadow-custom-white">
              <h2 className="headline">CONNECT</h2>
              <WalletConnectModal
                title="Connect wallet"
                icon={walletConnectIcon}
                onCallback={handleConnect}
              />
            </div>
          </div>
        </div>
      )}
      {view === View.CONNECTED && (
        <>
          <div className="flex flex-col gap-2 p-2 mb-4">
            <div className="hidden">
              <PrimaryButton
                title="Disconnectt"
                className="bg-red-200 border border-red-300 active:bg-red-300"
                textColor="customBlackText"
                callback={handleDisconnect}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default App;
