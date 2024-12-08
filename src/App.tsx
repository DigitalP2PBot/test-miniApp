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

import logo from "./assets/digital_p2p_logo.png";

import PrimaryButton from "./components/buttons/PrimaryButton";

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
const env = import.meta.env.VITE_ENVIRONMENT;

const USDTAbi = [
  "function approve(address spender, uint256 value) view returns (bool)",
];

const digitalP2PExchangeAbi = [
  "function processOrder(string _orderId, uint256 cryptoAmount)",
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
  const [logMesasgeError, setLogMessageError] = useState<string>("");
  const [logMesasgeSuccess, setLogMessageSuccess] = useState<string>("");
  const [connectionStatus, setConnectionStatus] =
    useState<AccountControllerState["status"]>();
  const [messageLog, setMessageLog] = useState<string>("");

  const telegramWebApp = window.Telegram.WebApp;

  const urlParams = new URLSearchParams(window.location.search);
  const orderId: string = urlParams.get("orderId") as string;
  const cryptoAmount: number = parseFloat(
    urlParams.get("cryptoAmount") as string
  );
  const summaryCopy =
    (urlParams.get("summaryCopy") as string) ?? "Resumen de la orden";
  const buttonTitle =
    (urlParams.get("buttonTitleCopy") as string) ?? "Conectar billetera";
  const orderCopy = (urlParams.get("orderCopy") as string) ?? "Orden id";
  const cyprtoAmountCopy =
    (urlParams.get("cryptoAmountCopy") as string) ?? "Usdt a transferir";
  const approveTransactionCopy =
    (urlParams.get("approveTransactionCopy") as string) ?? "Depositar fondos";
  const walletAddressCopy =
    (urlParams.get("walletAddressCopy") as string) ??
    "Dirección de tu billetera";

  const connectionState = useSelector(
    (state: RootState) => state.connection.connectionState
  );

  const dispatch = useDispatch<AppDispatch>();
  const cryptoAmountScaleToUsdtDecimals = (amount: number) => {
    return Math.round(amount * 1e6);
  };
  const approveTransaction = async () => {
    const ethersProvider = new BrowserProvider(
      walletProvider as Eip1193Provider
    );
    const signer = await ethersProvider.getSigner();
    console.log("digitalP2PExchangeAddress", digitalP2PExchangeAddress);
    console.log("polygonUsdtAddress", polygonUsdtAddress);
    const usdtContract = new Contract(polygonUsdtAddress, USDTAbi, signer);
    const digitalP2PCanMoveFunds = await usdtContract
      .approve(
        digitalP2PExchangeAddress,
        cryptoAmountScaleToUsdtDecimals(cryptoAmount)
      )
      .then((res) => {
        console.log("res", res);
        return res;
      });
    if (digitalP2PCanMoveFunds) {
      const digitalP2PExchangeContract = new Contract(
        digitalP2PExchangeAddress,
        digitalP2PExchangeAbi,
        signer
      );
      try {
        console.log("pass de approved", digitalP2PCanMoveFunds);
        console.log("value", cryptoAmountScaleToUsdtDecimals(cryptoAmount));
        await digitalP2PExchangeContract
          .processOrder(orderId, cryptoAmountScaleToUsdtDecimals(cryptoAmount))
          .then((res) => {
            console.log("res", res);
            return res;
          });
        setLogMessageSuccess("Transacción aprobada con éxito");
      } catch (e) {
        console.log("error", e);
        setLogMessageError(
          "Error al aprobar la transacción, verifica que tienes suficientes fondos"
        );
      }
    } else {
      setLogMessageError(
        "Debes aprobar la transacción para continuar con el intercambio"
      );
    }
  };
  const disconnectUser = async () => {
    await disconnect();
    await close();
  };

  const getAccountData = () => {
    //const providerId = window.localStorage.getItem("providerId");
  };

  const handleConnect = (
    isConnected: boolean,
    status: AccountControllerState["status"],
    address?: string
    //selectedNetworkId: CaipNetworkId
  ) => {
    console.log("handle connect ", isConnected, status, address);
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
    console.log("disconnect user", connectionState);
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
    await disconnectUser();
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
            {logMesasgeError && (
              <>
                <div
                  className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  {logMesasgeError}
                </div>
              </>
            )}
            {logMesasgeSuccess && (
              <>
                <div
                  className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  {logMesasgeSuccess}
                </div>
              </>
            )}
            <div>
              {connectionStatus === walletConnectionState.CONNECTED && (
                <>
                  <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                    {walletAddressCopy}: {userWalletAddress}
                  </p>
                </>
              )}
              <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                {summaryCopy}:
              </p>

              <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                {orderCopy}: {orderId}
              </p>

              <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                {cyprtoAmountCopy}: {cryptoAmount}
              </p>
              {env === "dev" && (
                <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                  Message log {messageLog}
                </p>
              )}
            </div>
          </div>
          {view === View.CONNECTED && (
            <>
              <PrimaryButton
                title={approveTransactionCopy}
                callback={approveTransaction}
              />
              {env === "dev" && (
                <PrimaryButton title="Disconnect" callback={handleDisconnect} />
              )}
            </>
          )}
          {view === View.CONNECT && (
            <WalletConnectModal
              title={buttonTitle}
              onCallback={handleConnect}
              icon={logo}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default App;
