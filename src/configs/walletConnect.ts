import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { polygon, polygonAmoy } from "@reown/appkit/networks";

const DEFAULT_NETWORK = import.meta.env.VITE_DEFAULT_NETWORK || "polygon";
const defaultNetwork = DEFAULT_NETWORK == "polygon" ? polygon : polygonAmoy;
export const createWalletConnectModal = () => {
  const projectId =
    import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || ("" as string);

  const metadata = {
    name: "DigitalP2P Exchange",
    description: "DigitalP2P Defi Protocol",
    url: "https://digitalp2p.co", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"],
  };

  createAppKit({
    adapters: [new EthersAdapter()],
    networks: [defaultNetwork],
    defaultNetwork: defaultNetwork,
    metadata,
    projectId,
    features: {
      analytics: true, // Optional - defaults to your Cloud configuration
    },
  });
};
