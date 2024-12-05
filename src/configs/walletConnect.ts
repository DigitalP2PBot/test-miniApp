import { createAppKit } from "@reown/appkit/react";
import { polygon, polygonAmoy } from "@reown/appkit/networks";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

import { cookieStorage, createStorage } from "@wagmi/core";

const DEFAULT_NETWORK = import.meta.env.VITE_DEFAULT_NETWORK || "polygon";
const defaultNetwork = DEFAULT_NETWORK == "polygon" ? polygon : polygonAmoy;
export const createWalletConnectModal = () => {
  const projectId =
    import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || ("" as string);
  const networks = [defaultNetwork];

  const metadata = {
    name: "DigitalP2P",
    description: "DigitalP2P Defi Protocol",
    url: "https://digitalp2pbot.github.io", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"],
  };
  const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    networks,
    projectId,
  });

  createAppKit({
    adapters: [wagmiAdapter],
    networks: [defaultNetwork],
    defaultNetwork: defaultNetwork,
    metadata,
    projectId,
    features: {
      analytics: true, // Optional - defaults to your Cloud configuration
      socials: false, // Optional - defaults to your Cloud configuration
      emailShowWallets: false,
      email: false,
    },
  });
};
