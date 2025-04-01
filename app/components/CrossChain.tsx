import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWallets, useSolanaWallets } from "@privy-io/react-auth";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Token type definition
interface Token {
  chain: string;
  symbol: string;
  balance: string;
}

const MultiChainTokens = () => {
  const { wallets: evmWallets } = useWallets();
  const { wallets: solanaWallets } = useSolanaWallets();
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    const fetchTokens = async () => {
      const tokenList: Token[] = [];

      let ethBalance = 0;
      for (const wallet of evmWallets) {
        const chainId = wallet.chainId.split(":")[1];
        if (chainId === "1") { 
          const web3 = new Web3("https://ethereum-rpc.publicnode.com");
          const balance = await web3.eth.getBalance(wallet.address);
          ethBalance += parseFloat(web3.utils.fromWei(balance, "ether"));
        }
      }
      if (ethBalance >= 0) {
        tokenList.push({
          chain: "Ethereum",
          symbol: "ETH",
          balance: ethBalance.toString(),
        });
      }
      let solBalance = 0;
      let sonicBalance = 0;
      for (const wallet of solanaWallets) {
        const address = wallet.address;

        // Fetch Solana balance (assuming devnet for testing)
        const solConnection = new Connection(
          "https://api.devnet.solana.com",
          "confirmed"
        );
        const solBalanceRaw = await solConnection.getBalance(
          new PublicKey(address)
        );
        solBalance += solBalanceRaw / LAMPORTS_PER_SOL;

        // Fetch Sonic balance
        const sonicConnection = new Connection(
          "https://api.testnet.sonic.game",
          "confirmed"
        );
        const sonicBalanceRaw = await sonicConnection.getBalance(
          new PublicKey(address)
        );
        sonicBalance += sonicBalanceRaw / LAMPORTS_PER_SOL;
      }

      // Add Solana
      if (solBalance >= 0) {
        tokenList.push({
          chain: "Solana",
          symbol: "SOL",
          balance: solBalance.toString(),
        });
      }
      // Add Sonic
      if (sonicBalance >= 0) {
        tokenList.push({
          chain: "Solana",
          symbol: "S",
          balance: sonicBalance.toString(),
        });
      }

      setTokens(tokenList);
    };

    fetchTokens().catch(error => {
      console.error("Failed to fetch tokens:", error);
    });
  }, []);

  return (
    <div>
      <h2>보유 토큰 리스트</h2>
      {tokens.length > 0 ? (
        tokens.map((token, index) => (
          <div key={index}>
            <p>
              {token.chain} - {token.symbol}: {token.balance}
            </p>
          </div>
        ))
      ) : (
        <p>연결된 지갑이 없거나 토큰이 없습니다.</p>
      )}
    </div>
  );
};

export default MultiChainTokens;