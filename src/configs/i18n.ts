import i18n from "i18next";
import { initReactI18next } from "react-i18next";

type TranslationResources = {
  [key: string]: {
    translation: { [key: string]: string };
  };
};

const resources: TranslationResources = {
  en: {
    translation: {
      processing: "Starting order...",
      summaryOrder: "Order Summary",
      buttonConnectWalleTitle: "Connect Wallet",
      orderId: "Order ID",
      cryptoAmount: "Crypto Amount",
      depositFund: "Deposit Fund",
      walletAddress: "Wallet Address",
      errorApprovingTransaction:
        "You should approve the transaction to continue the trade",
      transactionApproved: "Transaction approved",
      walletNotConnected: "Wallet not connected",
      tokenAddress: "Polygon address (USDT)",
      digialP2PExchangeAddress: "Digital P2P Exchange Address",
      processOrderButtonTitle: "Processing order...",
      transactionInfo:
        "Transaction Info! Go to your wallet and approve the transaction",
      transactionApprovedHelp:
        "You should approve the transaction in your wallet to move the funds",
    },
  },
  es: {
    translation: {
      processing: "Iniciando orden...",
      summaryOrder: "Resumen de la orden",
      buttonConnectWalleTitle: "Conectar Wallet",
      orderId: "ID de la orden",
      cryptoAmount: "USDT a transferir",
      depositFund: "Depositar fondos",
      walletAddress: "Dirección de la billetera",
      errorApprovingTransaction:
        "Debes aprobar la transacción para continuar con el intercambio",
      transactionApproved: "Transacción aprobada",
      walletNotConnected: "No se ha detectado una billetera conectada",
      tokenAddress: "Polygon token (USDT) ${tokenAddress}",
      digitalP2PExchangeAddress: "Dirección del contrato de intercambio",
      processOrderButtonTitle: "Procesando orden...",
      transactionInfo: "Ve a tu billetera y aprueba la transacción",

      transactionApprovedHelp:
        "Debes aprobar la transacción en tu billetera para mover los fondos",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "es", // language to use
  interpolation: {
    escapeValue: false, // react already safes from XSS
  },
});

export default i18n;
