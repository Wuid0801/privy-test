import { useState } from "react";
import { useSolanaWallets } from "@privy-io/react-auth/solana";

function SignMessageSol() {
  const [hasSigned, setHasSigned] = useState(false);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState<string | null>(null);

  const message = "This is a test message for the signing feature.";
  const { wallets } = useSolanaWallets();

  if (!wallets.length) {
    return <div>먼저 지갑을 연결해주세요.</div>;
  }

  const wallet = wallets[0];

  const handleSign = async () => {
    try {
      const provider = await wallet.getProvider();
      const { signature } = await provider.request({
        method: 'signMessage',
        params: { message },
      });
      setSignature(signature);
      setHasSigned(true);
      setError(null);
    } catch (err) {
      console.error("서명 오류:", err);
      setError("메시지 서명에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
        onClick={handleSign}
      >
        메시지 서명
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {hasSigned && (
        <p className="mt-2">서명된 메시지와 서명: {signature}</p>
      )}
    </div>
  );
}

export default SignMessageSol;