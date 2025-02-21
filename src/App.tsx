import { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { AppDispatch, RootState } from "./redux/store";
import { AccountControllerState } from "@reown/appkit-core";

import { BrowserProvider, Contract, Eip1193Provider, ethers } from "ethers";
import {
  useDisconnect,
  useAppKitProvider,
  useAppKit,
} from "@reown/appkit/react";

import PrimaryButton from "./components/buttons/PrimaryButton";
import LoadingButton from "./components/buttons/LoadingButton";
import GhostButton from "./components/buttons/GhostButton";

import WalletConnectModal from "./components/connectors/WalletConnectModal";

import LayoutHeader from "./components/organism/LayuotHeader";
import InfoLabel from "./components/organism/InfoLabel";
import InfoCard from "./components/organism/InfoCard";
import StatusLabel from "./components/organism/StatusLabel";

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
  NOT_APPROVED = "not_approved",
  PROCCESED = "processed",
  REJECTED = "rejected",
}

const env = import.meta.env.VITE_ENVIRONMENT;
const telegramCloseAppTimeOut = 2000;

const USDTAbi = [
  "function approve(address spender, uint256 value) returns (bool)",
];

const digitalP2PExchangeAbi = [
  "function processOrder(string _orderId, uint256 cryptoAmount, address tokenAddress)",
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
  const [networkId, setNetwotkId] = useState<string | undefined>("");

  const telegramWebApp = window.Telegram.WebApp;

  const urlParams = new URLSearchParams(window.location.search);
  const orderId: string = urlParams.get("orderId") as string;
  const cryptoAmount: number = parseFloat(
    urlParams.get("cryptoAmount") as string
  );
  const lang = urlParams.get("lang") as string;
  const digitalP2PExchangeAddress = urlParams.get(
    "networkP2pContractAddress"
  ) as string;
  const networkTokenAddress = urlParams.get("networkTokenAddress") as string;
  //const networkSymbol = urlParams.get("networkSymbol") as string;
  const networkDecimals = parseInt(urlParams.get("networkDecimals") as string);
  //const networkChainId = urlParams.get("networkChainId") as string;
  //const networkName = urlParams.get("networkName") as string;

  i18n.changeLanguage(lang ?? "es");
  const connectionState = useSelector(
    (state: RootState) => state.connection.connectionState
  );

  const dispatch = useDispatch<AppDispatch>();
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
    console.log("Network token address", networkTokenAddress);

    const usdtContract = new Contract(networkTokenAddress, USDTAbi, signer);

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
          ethers.parseUnits(cryptoAmount.toString(), networkDecimals)
        )
        .then((res) => {
          console.log("transaction approved", res);
          return res;
        });
      setTransactionState(TransactionState.APPROVED);
    } catch (e: any) {
      let errorMessage = "errorApprovingTransaction";
      if (e.reason === "rejected") errorMessage = "errorTransactionNotApproved";
      console.log("error approving transaction", e);
      setTransactionState(TransactionState.NOT_APPROVED);
      setLogMessageError(i18n.t(errorMessage));
      return;
    }
    if (digitalP2PCanMoveFunds) {
      try {
        await digitalP2PExchangeContract
          .processOrder(
            orderId,
            ethers.parseUnits(cryptoAmount.toString(), networkDecimals),
            networkTokenAddress,
            {
              gasLimit: 200000,
            }
          )
          .then((res) => {
            console.log("transaction processed", res);
          });
        setLogMessageSuccess(i18n.t("transactionApproved"));
        setTransactionState(TransactionState.PROCCESED);
        setTimeout(() => {
          telegramWebApp.close();
        }, telegramCloseAppTimeOut);
      } catch (e: any) {
        console.log("error", e);
        let errorMessage = "errorTransactionProcessOrder";
        if (e.reason === "rejected") errorMessage = "errorTransactionRejected";
        setTransactionState(TransactionState.REJECTED);
        setLogMessageError(i18n.t(errorMessage));
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
    address?: string,
    selectedNetworkId?: string
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
    setNetwotkId(selectedNetworkId);
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
    <div className="bg-azureishWhite min-h-screen">
      <LayoutHeader />
      <main className="flex flex-col h-80v w-screen rounded-xl">
        <div className="flex flex-col flex-grow min-h-full justify-end">
          <div className="components-container">
            <div className="flex flex-col bg-white pt-4 pr-8 pb-8 pl-8 gap-4 rounded-t-3xl rounded-b-xl shadow-custom-white">
              {env === "dev" && (
                <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
                  Message log {messageLog}
                </p>
              )}
              {logMesasgeError && (
                <>
                  <div
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 font-medium"
                    role="alert"
                  >
                    {logMesasgeError}
                  </div>
                </>
              )}
              {logMesasgeSuccess && (
                <>
                  <div
                    className="p-4 mb-4 text-sm text-oceanGreen rounded-lg bg-azureishWhite dark:bg-gray-800 dark:text-green-400 font-medium"
                    role="alert"
                  >
                    {logMesasgeSuccess}
                  </div>
                </>
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
              <div>
                {connectionStatus === walletConnectionState.CONNECTED && (
                  <>
                    <InfoLabel
                      label={i18n.t("networkId")}
                      content={networkId}
                    />

                    <InfoLabel
                      label={i18n.t("walletAddress")}
                      content={userWalletAddress}
                    />
                  </>
                )}
                <h3 className="text-xl">{i18n.t("summaryOrder")}:</h3>

                <InfoLabel
                  label={i18n.t("orderId")}
                  content={orderId}
                ></InfoLabel>

                <InfoLabel
                  label={i18n.t("cryptoAmount")}
                  content={String(cryptoAmount)}
                ></InfoLabel>

                {connectionStatus === walletConnectionState.CONNECTED && (
                  <InfoCard
                    content={
                      <>
                        <h5 className="mt-0 mr-0 mb-4 ml-0 text-left">
                          {i18n.t("transactionTitle")}:
                        </h5>
                        <StatusLabel
                          content={i18n.t("transactionToApprove")}
                          type={
                            transactionState == TransactionState.APPROVED ||
                            transactionState == TransactionState.PROCCESED ||
                            transactionState == TransactionState.REJECTED
                              ? "success"
                              : transactionState == TransactionState.PROCESSING
                                ? "pending"
                                : transactionState ==
                                    TransactionState.NOT_APPROVED
                                  ? "error"
                                  : "info"
                          }
                        />
                        <StatusLabel
                          content={i18n.t("transactionToMove")}
                          type={
                            transactionState == TransactionState.PROCCESED
                              ? "success"
                              : transactionState == TransactionState.APPROVED
                                ? "pending"
                                : transactionState == TransactionState.REJECTED
                                  ? "error"
                                  : "info"
                          }
                        />
                      </>
                    }
                  />
                )}
              </div>
            </div>
            <footer className="flex flex-col gap-4 p-8 pt-0 bg-white rounded-xl shadow-custom-white">
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
                  <GhostButton title="Disconnect" callback={handleDisconnect} />
                </>
              )}

              {view === View.CONNECT && (
                <WalletConnectModal
                  title={i18n.t("buttonConnectWalleTitle")}
                  onCallback={handleConnect}
                />
              )}
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
export default App;
