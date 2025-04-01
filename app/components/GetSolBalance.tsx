import * as web3 from "@solana/web3.js";
import {Keypair} from '@solana/web3.js';
import bs58 from 'bs58';


function GetSolBalanceButton() {
    const feePayerWallet = new Keypair();
    const feePayerAddress = feePayerWallet.publicKey.toBase58();
    const feePayerPrivateKey = bs58.encode(feePayerWallet.secretKey);

    
  const connection = new web3.Connection(
    web3.clusterApiUrl("mainnet-beta"),
    "confirmed"
  );

  // 유효한 Base58 형식의 지갑 주소 예시 (실제 사용하는 지갑 주소로 대체하세요)
  const publicKey = new web3.PublicKey("2dTS8noXndA2S9yBHhi65ba3TCp3GSCLAv1KVVJHZZYf");

  async function GetSol() {
    try {
      // 잔액 조회 (lamports 단위)
      const balance = await connection.getBalance(publicKey);
      // lamports를 SOL로 변환 (1 SOL = 1,000,000,000 lamports)
      console.log("Your SOL balance:", balance / web3.LAMPORTS_PER_SOL, "SOL");
    } catch (err) {
      console.error("Error SOL balance:", err);
    }
  }

  return (
    <button onClick={GetSol}>
      BalanceButton
    </button>
  );
}

export default GetSolBalanceButton;
