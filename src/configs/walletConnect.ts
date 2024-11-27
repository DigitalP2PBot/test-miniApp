import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { polygon, polygonAmoy } from "@reown/appkit/networks";

export const createWalletConnectModal = () => {
  // 1. Get projectId
  const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "";

  // 2. Set the networks
  const networks = [polygon, polygonAmoy];

  // 3. Create a metadata object - optional
  const metadata = {
    name: "My Website",
    description: "My Website description",
    url: "https://mywebsite.com", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"],
  };

  // 4. Create a AppKit instance
  createAppKit({
    adapters: [new EthersAdapter()],
    networks,
    metadata,
    projectId,
    features: {
      analytics: true, // Optional - defaults to your Cloud configuration
    },
  });
};
