import { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { AppDispatch, RootState } from "./redux/store";
import { AccountControllerState } from "@reown/appkit-core";

import { BrowserProvider, Contract, Eip1193Provider } from "ethers";
import {
  useDisconnect,
  useAppKitProvider,
  useAppKit,
} from "@reown/appkit/react";
import PrimaryButton from "./components/buttons/PrimaryButton";

import walletConnectIcon from "./assets/wallet_connect.png";
import WalletConnectModal from "./components/connectors/WalletConnectModal";
import { useDispatch, useSelector } from "react-redux";
import { setConnectionState } from "./redux/connectionSlice";

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
  const { close } = useAppKit();
  const { walletProvider } = useAppKitProvider("eip155");
  const { disconnect } = useDisconnect();
  const [view, setView] = useState<View>(View.CONNECT);
  const [userWalletAddress, setWalletAddress] = useState<string | undefined>(
    ""
  );
  const [connectionStatus, setConnectionStatus] =
    useState<AccountControllerState["status"]>();
  const [messageLog, setMessageLog] = useState<string>("");

  const telegramWebApp = window.Telegram.WebApp;

  // Parse query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const orderId: string = urlParams.get("orderId") as string;
  const cryptoAmount: number = parseFloat(
    urlParams.get("cryptoAmount") as string
  );

  const connectionState = useSelector(
    (state: RootState) => state.connection.connectionState
  );

  const dispatch = useDispatch<AppDispatch>();

  //const skip = () => {
  //  setView(view + 1);
  //};
  //const goBack = () => {
  //  if (view === View.LANDING) {
  //   return;
  //}
  //  setView(view - 1);
  //};

  //const openWallet = () => {
  //  setView(View.WALLET);
  //};
  const approveTransaction = async () => {
    const ethersProvider = new BrowserProvider(
      walletProvider as Eip1193Provider
    );
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
        orderId,
        cryptoAmount,
        cryptoAmount
      );
    }
    await disconnect();
    await close();
  };
  const disconnectUser = async () => {
    await disconnect();
    await close();
  };

  // Get Accounts
  //const [account, setAccount] = useState<string | null>(null);
  //const [balance, setBalance] = useState<string | null>(null);

  const getAccountData = () => {
    //const providerId = window.localStorage.getItem("providerId");
  };

  const handleConnect = (
    isConnected: boolean,
    status: AccountControllerState["status"],
    address?: string
    //selectedNetworkId: CaipNetworkId
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
  //const [signedMessage, setSignedMessage] = useState<string | null>(null);

  // Disconnect
  const handleDisconnect = async () => {
    await disconnect();
    dispatch(setConnectionState(walletConnectionState.DISCONNECTED));
  };

  useEffect(() => {
    // Access the WebApp object

    // Log the values
    const logMessage = `location search ${window.location.search} app data ${telegramWebApp.initData}`;
    setMessageLog(logMessage);
  }, []);
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
                Order Summary Test
              </p>

              <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                Message log {messageLog}
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

              <PrimaryButton title="Disconnect" callback={disconnectUser} />
            </>
          )}
          {view === View.CONNECT && (
            <WalletConnectModal
              title="Connect wallet"
              icon={walletConnectIcon}
              onCallback={handleConnect}
            />
          )}
        </div>
      </div>
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
