"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import {toSolanaWalletConnectors} from '@privy-io/react-auth/solana';

const solanaConnectors = toSolanaWalletConnectors({
  // By default, shouldAutoConnect is enabled
  shouldAutoConnect: true,
  
});

const handleLogin = (user: any) => {

  console.log(`User ${user.id} logged in!`);
  console.log('User wallets:', user.wallets);
};

function PrivyProviderB({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      onSuccess={handleLogin}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://thumbs.dreamstime.com/b/demo-rubber-stamp-grunge-design-dust-scratches-effects-can-be-easily-removed-clean-crisp-look-color-easily-changed-82616276.jpg",
          walletList: ['phantom'],
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors ,
          },
        },
        loginMethods: ['email', 'wallet', 'google', 'twitter'],
        embeddedWallets: {
          createOnLogin: 'off',//'off', //'all-users'?
          
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

export default PrivyProviderB;
