import { useState } from "react";
import { User } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth";

type Props = {
  user: User;
};

function SignMessageSol({ user }: Props) {
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const { wallets } = useSolanaWallets();
  console.log("메세지 테스트 부분 지갑 확인", wallets)
  const message = "This is a test message for the signing feature.";

  const handleSign = async () => {
    if (!selectedWallet) {
      setError("월렛을 선택해주세요.");
      return;
    }

    try {
      const wallet = wallets.find((w) => w.address === selectedWallet);
      if (!wallet) {
        setError("선택한 월렛을 찾을 수 없습니다.");
        return;
      }

      const provider = await wallet.getProvider();
      const { signature } = await provider.request({
        method: "signMessage",
        params: { message },
      });

      setSignature(signature);
      setError(null);
    } catch (err) {
      console.error("서명 오류:", err);
      setError("메시지 서명에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <select
        value={selectedWallet || ""}
        onChange={(e) => setSelectedWallet(e.target.value)}
        className="mt-4 mr-2 p-2 border rounded"
      >
        <option value="">월렛을 선택하세요</option>
        {wallets.map((wallet) => (
          <option key={wallet.address} value={wallet.address}>
            {wallet.meta.name} ({wallet.address.slice(0, 6)}...)
          </option>
        ))}
      </select>
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
        onClick={handleSign}
      >
        Sign A Message
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {signature && (
        <p className="mt-2">Signed Message With Signature: {signature}</p>
      )}
    </div>
  );
}

export default SignMessageSol;
