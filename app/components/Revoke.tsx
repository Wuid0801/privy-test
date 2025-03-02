import { usePrivy, useDelegatedActions } from "@privy-io/react-auth";

export function RevokeDelegation() {
  const { user } = usePrivy();
  const { revokeWallets } = useDelegatedActions();

  if (!user) {
    return <div>Loading...</div>;
  }

  // 위임된 지갑이 있는지 확인
  const hasDelegatedWallets = user.linkedAccounts.some(
    (account) => account.type === "wallet" && account.delegated
  );

  // 권한 취소 함수
  const onRevoke = async () => {
    try {
      await revokeWallets();
      alert("모든 위임된 지갑의 권한이 성공적으로 취소되었습니다!");
    } catch (error) {
      console.error("권한 취소 실패:", error);
      alert("권한 취소에 실패했습니다.");
    }
  };

  return (
    <button
      disabled={!hasDelegatedWallets}
      onClick={onRevoke}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Revoke All Delegations
    </button>
  );
}
