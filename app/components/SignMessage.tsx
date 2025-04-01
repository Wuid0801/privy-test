"use client";

import { useState } from "react";
import { User,usePrivy } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";

type Props = {
  user: User;
};

function SignMessage({ user }: Props) {
  const [hasSigned, setHasSigned] = useState(false);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState<string | null>(null);

  // unlinkWallet 함수를 추가하여 연결된 지갑을 해제할 수 있습니다.
  const { unlinkWallet } = usePrivy();
  const { wallets } = useSolanaWallets();
  console.log("가져온 지갑", wallets);

  const message = "This is a test message for the signing feature.";
  // Privy 임베디드 월렛을 찾음
  const wallet = wallets.find((w) => w.walletClientType === "privy");


  const handleSign = async () => {
    try {
      const provider = await wallet?.getProvider();
      const response = await provider?.request({
        method: "signMessage",
        params: { message },
      });
      const sig = response.signature || response;
      setSignature(sig);
      setHasSigned(true);
      setError(null);
    } catch (err) {

      setError("메시지 서명에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const clearWallets = async () => {
    try {
      // Phantom 지갑 찾기: walletClientType이 "phantom"인 지갑
      const phantomWallet = wallets.find((w) => w.walletClientType === "phantom");
      if (phantomWallet) {
        await unlinkWallet(phantomWallet.address);
        console.log("Phantom wallet unlinked successfully.");
      } else {
        console.log("연결된 Phantom 지갑이 없습니다.");
      }
    } catch (err) {
      console.error("Phantom 지갑 언링크 오류:", err);
      setError("Phantom 지갑 언링크에 실패했습니다.");
    }
  };

  return (
    <div>
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
        disabled={!user.wallet}
        onClick={handleSign}
      >
        Sign A Message
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {hasSigned && (
        <p className="mt-2">Signed Message With Signature: {signature}</p>
      )}
      <button
        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 mr-2"
        onClick={clearWallets}
      >
        Clear Wallets
      </button>
    </div>
  );
}

export default SignMessage;
