import { useDelegatedActions, useSolanaWallets } from "@privy-io/react-auth";

function ConnectWithoutSignature() {
  // 연결된 월렛 목록 가져오기
  const { wallets } = useSolanaWallets();
  // useDelegatedActions에서 delegateWallet 함수 추출
  const { delegateWallet } = useDelegatedActions();

  // Phantom 월렛 찾기 (Solana 체인에서 Phantom 클라이언트 타입으로 식별)
  const phantomWallet = wallets.find(w => w.walletClientType === 'phantom' && w.connectorType === 'solana_adapter');

  // Phantom 월렛이 연결된 경우
  if (phantomWallet) {
    const setupDelegation = async () => {
      try {

        await delegateWallet({
          address: phantomWallet.address, 
          chainType: 'solana',           
        });
        console.log('권한 위임이 성공적으로 설정되었습니다.');
      } catch (error) {
        console.error('권한 위임 설정 중 오류 발생:', error);
      }
    };

    return (
      <button onClick={setupDelegation}>권한 위임 설정</button>
    );
  } else {
    return <p>Phantom 월렛을 연결해주세요.</p>;
  }
}

export default ConnectWithoutSignature;