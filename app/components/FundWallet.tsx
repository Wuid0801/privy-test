import React from "react";
import { useFundWallet } from "@privy-io/react-auth/solana";

function FundWallet() {
  const { fundWallet } = useFundWallet();

  const handleFundWallet = async () => {
    try {
      await fundWallet('your-wallet-address-here', {
        cluster: { name: 'devnet' },
        amount: '0.01', // SOL
      });
      console.log("Wallet funded successfully.");
    } catch (error) {
      console.error("Error funding wallet:", error);
    }
  };

  return (
    <div>
      <button onClick={handleFundWallet}>
        Fund Wallet
      </button>
    </div>
  );
}

export default FundWallet;
