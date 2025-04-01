import { usePrivy } from "@privy-io/react-auth";
import { 
  useSolanaWallets, 
} from "@privy-io/react-auth/solana";
import { useState } from "react";

export default function WalletButton() {
  const { connectWallet, connectOrCreateWallet, login, user, logout, } = usePrivy();
  const { wallets } = useSolanaWallets();
  const [connectionStatus, setConnectionStatus] = useState("");

  const externalWallet = wallets.find(
    (wallet) => wallet.walletClientType !== "privy"
  );
  const handleDisconnect = async () => {
    if (externalWallet) {
      try {
        // Phantom 지갑이 있는 경우 연결 해제
        if (externalWallet.walletClientType === "phantom") {
          externalWallet.disconnect();
          setConnectionStatus("Phantom 지갑 연결이 해제되었습니다.");
        }

        
        setConnectionStatus("외부 지갑 연결이 해제되었습니다. 다시 로그인해주세요.");
      } catch (error) {
        console.error("지갑 연결 해제 오류:", error);
        setConnectionStatus("지갑 연결 해제에 실패했습니다.");
      }
    } else {
      setConnectionStatus("연결된 외부 지갑이 없습니다.");
    }
  };

  return (
    <>
      <div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={connectWallet}>Connect external Solana wallet</button>
        {externalWallet ? (
          <div>
            <p>Connected external Solana wallet: {externalWallet.address}</p>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-500 text-white rounded mt-2"
            >
              Disconnect external wallet
            </button>
          </div>
        ) : (
          <p>No external Solana wallet connected. {connectionStatus}</p>
        )}
        {wallets.length > 0 && wallets[0].walletClientType === "privy" && (
          <div>
            <p>Privy Embedded Wall: {wallets[0].address}</p>
          </div>
        )}
      </div>
      <div>
        {!wallets.length ? (
          <button onClick={login}>Connect Solana wallet</button>
        ) : (
          <div>
            <p>Connected Solana wallet: {wallets[0].address}</p>
          </div>
        )}
      </div>
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={connectWallet}>Connect wallet2</button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={connectOrCreateWallet}>Connect wallet3</button>
    </>
  );
}