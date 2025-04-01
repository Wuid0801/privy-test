"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { useDelegatedActions, WalletWithMetadata } from "@privy-io/react-auth";
import { useFundWallet } from "@privy-io/react-auth/solana";
import { useState } from "react";

export default function WalletCard() {
  const { user, ready, authenticated } = usePrivy();
  const { wallets, createWallet, exportWallet } = useSolanaWallets();
  const { delegateWallet, revokeWallets } = useDelegatedActions();
  const { fundWallet } = useFundWallet();
  const [loading, setLoading] = useState(false);

  // 페이지 로딩 상태 확인
  if (!ready) {
    return <div>Loading...</div>;
  }

  // 인증되지 않은 경우
  if (!authenticated) {
    return <div>Please log in to view your wallets.</div>;
  }

  // Privy 임베디드 월렛 찾기
  const embeddedWallet = user?.linkedAccounts.find(
    (account) => account.type === "wallet" && account.chainType === "solana"
  ) as WalletWithMetadata | undefined;
  // Phantom 월렛 찾기
  const phantomWallet = wallets.find(
    (w) => w.walletClientType === "phantom" && w.connectorType === "solana_adapter"
  );

  return (
    <div>
      <h2>Privy Embedded Wallets {embeddedWallet?.delegated ? "(Delegated)" : ""}</h2>

      {/* Privy 임베디드 월렛 정보 */}
      {embeddedWallet ? (
        <div>
          <p>Address: {embeddedWallet.address}</p>

        </div>
      ) : (
        <div>
          <p>You don&apos;t have an embedded wallet. Please create one.</p>
          <button
            onClick={async () => {
              try {
                setLoading(true);
                await createWallet();
                // Privy에서 자동으로 사용자 계정에 월렛 연결
              } catch (error) {
                console.error("Failed to create wallet:", error);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      )}

      {/* Privy 월렛 액션 버튼 */}
      {embeddedWallet && (
        <div>
          <button onClick={() => fundWallet(embeddedWallet.address)}>
            Deposit
          </button>
          <button
            onClick={async () => {
              if (!embeddedWallet.delegated) {
                await delegateWallet({
                  address: embeddedWallet.address,
                  chainType: "solana",
                });
              } else {
                await revokeWallets();
              }
            }}
          >
            {embeddedWallet.delegated ? "Revoke" : "Delegate"}
          </button>
          <button onClick={() => exportWallet({ address: embeddedWallet.address })}>
            Export
          </button>
        </div>
      )}

      {/* Phantom 월렛 연결 및 위임 */}
      <div>
        {phantomWallet ? (
          <button
            onClick={async () => {
              try {
                await delegateWallet({
                  address: phantomWallet.address,
                  chainType: "solana",
                });
                console.log("권한 위임이 성공적으로 설정되었습니다.");
              } catch (error) {
                console.error("권한 위임 설정 중 오류 발생:", error);
              }
            }}
          >
            Delegate Phantom Wallet
          </button>
        ) : (
          <p>Phantom 월렛을 연결해주세요.</p>
        )}
      </div>
    </div>
  );
}