import { useSolanaWallets } from "@privy-io/react-auth/solana";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { usePrivy } from "@privy-io/react-auth";

export function SendSolWithEmbeddedWallet() {
  const { wallets } = useSolanaWallets();
  const { user } = usePrivy();
  const connection = new Connection("https://api.testnet.sonic.game");

  const handleSend = async () => {
    try {
      const senderWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      );
      if (!senderWallet) {
        console.error("no sender wallet.");
        return;
      }

      const senderPubKey = new PublicKey(senderWallet.address);
      const recipientPubKey = new PublicKey(
        "BsDUuApLcEiSXySNqkb4ZmS4i52cFiZ5WP1ZdvnVpbqx"
      );
      const lamports = 0.001 * 1e9;

      const { blockhash } = await connection.getLatestBlockhash();

      const transaction = new Transaction();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderPubKey;

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: senderPubKey,
          toPubkey: recipientPubKey,
          lamports,
        })
      );

      const signedTx = await senderWallet.signTransaction(transaction);

      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );


    } catch (error) {
      console.error("error:", error);
    }
  };

  return (
    <button
      onClick={handleSend}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {0.001} SOL 전송 (Privy Embedded Wallet)
    </button>
  );
}
