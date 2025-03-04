import { useState } from "react";
import { User } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
type Props = {
  user: User;
};

function SignMessage({ user }: Props) {
  const [hasSigned, setHasSigned] = useState(false);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState<string | null>(null);

  
  const { wallets } = useSolanaWallets();
  const message = "This is a test message for the signing feature.";
  const wallet = wallets[0];
  const handleSign = async () => {
    try {

      // user.wallet에서 provider를 가져옴

      const provider = await wallet.getProvider();
      // provider.request를 사용하여 서명 요청
      const response = await provider.request({
        method: "signMessage",
        params: { message },
      });

      const sig = response.signature || response;
      setSignature(sig);
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
        disabled={!user.wallet}
        onClick={handleSign}
      >
        Sign A Message
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {hasSigned && (
        <p className="mt-2">Signed Message With Signature: {signature}</p>
      )}
    </div>
  );
}

export default SignMessage;
