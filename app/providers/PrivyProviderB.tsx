"use client";

import {
  addPrivyRpcToChain,
  PrivyProvider,
  usePrivy,
} from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { useEffect } from "react";
import { defineChain } from "viem";
import { base, polygon, arbitrum, mantle } from "viem/chains";

const sonicTestnetChain = defineChain({
  id: 146,
  name: "Sonic Testnet",
  rpcUrls: {
    default: { http: ["https://api.testnet.sonic.game"] },
    public: {
      http: ["https://api.testnet.sonic.game"],
      webSocket: undefined,
    },
  },
  nativeCurrency: {
    name: "Sonic Token",
    symbol: "S",
    decimals: 18,
  },
  testnet: true,
  network: "",
});

addPrivyRpcToChain(sonicTestnetChain, "https://api.testnet.sonic.game");

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
});

function PrivyProviderB({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://thumbs.dreamstime.com/b/demo-rubber-stamp-grunge-design-dust-scratches-effects-can-be-easily-removed-clean-crisp-look-color-easily-changed-82616276.jpg",
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        loginMethods: ["wallet", "twitter"],
        // embeddedWallets: {
        //   solana: {
        //     createOnLogin: "users-without-wallets", // defaults to 'off'
        //   },
        //   ethereum: {
        //     createOnLogin: "users-without-wallets", // defaults to 'off'
        //   },
        // },
        defaultChain: sonicTestnetChain,
        supportedChains: [sonicTestnetChain, base, polygon, arbitrum, mantle],

        solanaClusters: [
          { name: "mainnet-beta", rpcUrl: "https://api.devnet.solana.com" },
          { name: "testnet", rpcUrl: "https://api.testnet.sonic.game" },
        ],
      }}
    >
      {children}
    </PrivyProvider>
  );
}

export default PrivyProviderB;
