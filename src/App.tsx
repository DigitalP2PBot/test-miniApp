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
import LoadingButton from "./components/buttons/LoadingButton";

import WalletConnectModal from "./components/connectors/WalletConnectModal";

import { useDispatch, useSelector } from "react-redux";
import { setConnectionState } from "./redux/connectionSlice";
import i18n from "./configs/i18n";
import i18next from "i18next";

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

enum TransactionState {
  PENDING = "pending",
  PROCESSING = "processing",
  APPROVED = "approved",
  PROCCESED = "processed",
  REJECTED = "rejected",
}

const digitalP2PExchangeAddress = import.meta.env
  .VITE_DIGITALP2P_POLYGON_SM_ADDRESS;

const polygonUsdtAddress = import.meta.env.VITE_POLYGON_USDT_ADDRESS;
const env = import.meta.env.VITE_ENVIRONMENT;

const USDTAbi = [
  "function approve(address spender, uint256 value) returns (bool)",
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
  const [transactionState, setTransactionState] = useState<TransactionState>(
    TransactionState.PENDING
  );

  const telegramWebApp = window.Telegram.WebApp;

  const urlParams = new URLSearchParams(window.location.search);
  const orderId: string = urlParams.get("orderId") as string;
  const cryptoAmount: number = parseFloat(
    urlParams.get("cryptoAmount") as string
  );
  const lang = urlParams.get("lang") as string;
  i18n.changeLanguage(lang ?? "es");
  const connectionState = useSelector(
    (state: RootState) => state.connection.connectionState
  );

  const dispatch = useDispatch<AppDispatch>();
  const cryptoAmountScaleToUsdtDecimals = (amount: number) => {
    return Math.round(amount * 1e6);
  };
  const approveTransaction = async () => {
    setTransactionState(TransactionState.PROCESSING);
    const ethersProvider = new BrowserProvider(
      walletProvider as Eip1193Provider
    );

    let signer = null;
    try {
      signer = await ethersProvider.getSigner();
    } catch (e) {
      console.log("error get signer", e);
      setLogMessageError(i18n.t("walletNotConnected"));
      setTransactionState(TransactionState.PENDING);
      await handleDisconnect();
      return;
    }
    console.log("polygonUsdtAddress", polygonUsdtAddress);

    const usdtContract = new Contract(polygonUsdtAddress, USDTAbi, signer);

    const digitalP2PExchangeContract = new Contract(
      digitalP2PExchangeAddress,
      digitalP2PExchangeAbi,
      signer
    );

    let digitalP2PCanMoveFunds = false;
    try {
      digitalP2PCanMoveFunds = await usdtContract
        .approve(
          digitalP2PExchangeAddress,
          cryptoAmountScaleToUsdtDecimals(cryptoAmount)
        )
        .then((res) => {
          console.log("transaction approved", res);
          return res;
        });
      setTransactionState(TransactionState.APPROVED);
    } catch (e) {
      console.log("error approving transaction", e);
      setTransactionState(TransactionState.PENDING);
      setLogMessageError("Erro");
    }
    if (digitalP2PCanMoveFunds) {
      try {
        await digitalP2PExchangeContract
          .processOrder(
            orderId,
            cryptoAmountScaleToUsdtDecimals(cryptoAmount),
            {
              gasLimit: 300000,
            }
          )
          .then((res) => {
            console.log("transaction processed", res);
          });
        setLogMessageSuccess(i18n.t("transactionApproved"));
        setTransactionState(TransactionState.PROCCESED);
        setTimeout(() => {
          telegramWebApp.close();
        }, 5000);
      } catch (e) {
        console.log("error", e);
        setTransactionState(TransactionState.REJECTED);
        setLogMessageError(i18n.t("errorTransactionProcessOrder"));
      }
    } else {
      setTransactionState(TransactionState.PENDING);
      setLogMessageError(i18n.t("errorApprovingTransaction"));
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
              <h2 className="headline text-oceanGreen">DigitalP2P Exchange</h2>
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
                  className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
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
                    {i18n.t("digitalP2PExchangeAddress")}:{" "}
                    {digitalP2PExchangeAddress}
                  </p>
                  <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                    {i18n.t("walletAddress")}: {userWalletAddress}
                  </p>
                </>
              )}
              <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                {i18n.t("summaryOrder")}:
              </p>

              <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                {i18n.t("orderId")}: {orderId}
              </p>

              <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                {i18n.t("cryptoAmount")}: {cryptoAmount}
              </p>

              {connectionStatus === walletConnectionState.CONNECTED && (
                <>
                  <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                    Requerimos de dos transacciones para mover los fondos:
                  </p>
                  <p
                    className={`text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left ${
                      transactionState == TransactionState.APPROVED ||
                      transactionState == TransactionState.PROCCESED
                        ? "text-orangePeel"
                        : ""
                    }`}
                  >
                    1. Transación de aprobación para mover fondos.{" "}
                  </p>
                  <p
                    className={`text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left ${
                      transactionState == TransactionState.PROCCESED
                        ? "text-orangePeel"
                        : ""
                    }`}
                  >
                    2. Transación para mover fondos.
                  </p>
                </>
              )}
              {env === "dev" && (
                <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                  Message log {messageLog}
                </p>
              )}

              {transactionState === TransactionState.PROCESSING && (
                <div className="p-4 mb-4 text-sm text-oceanGreen rounded-lg bg-azureishWhite dark:bg-dimGray dark:text-orangePeel">
                  <span className="font-medium">
                    {i18n.t("transactionInfo")}
                  </span>{" "}
                </div>
              )}

              {transactionState === TransactionState.APPROVED && (
                <div className="p-4 mb-4 text-sm text-oceanGreen rounded-lg bg-azureishWhite dark:bg-dimGray dark:text-orangePeel">
                  <span className="font-medium">
                    {i18n.t("transactionApprovedHelp")}
                  </span>{" "}
                </div>
              )}
            </div>
          </div>
          {view === View.CONNECTED && (
            <>
              {transactionState === TransactionState.PENDING && (
                <PrimaryButton
                  title={i18n.t("depositFund")}
                  callback={approveTransaction}
                />
              )}
              {transactionState === TransactionState.PROCESSING && (
                <LoadingButton
                  title={i18next.t("processing")}
                  isLoading={true}
                />
              )}
              {transactionState === TransactionState.APPROVED && (
                <LoadingButton
                  title={i18next.t("processOrderButtonTitle")}
                  isLoading={true}
                />
              )}
              {env === "dev" && (
                <PrimaryButton title="Disconnect" callback={handleDisconnect} />
              )}
            </>
          )}
          {view === View.CONNECT && (
            <WalletConnectModal
              title={i18n.t("buttonConnectWalleTitle")}
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
