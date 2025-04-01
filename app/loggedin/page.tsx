"use client";

import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as web3 from "@solana/web3.js"; // Solana 라이브러리 추가
import SignMessage from "../components/SignMessage";
import SendTransaction from "../components/SendTransaction";
import { DelegateActionButton } from "../components/Delegate";
import { RevokeDelegation } from "../components/Revoke";
import SignMessageSol from "../components/SignMessageSol";
import ConnectWithoutSignature from "../components/DelegateTest";
import WalletCard from "../components/WalletCard";
import WalletButton from "../components/soltest";
import GetSolBalanceButton from "../components/GetSolBalance";
import FundWallet from "../components/FundWallet";
import { SendSolWithEmbeddedWallet } from "../components/WalletTransfer";
import SendTransactionExample from "../components/SendTransactionExample";
import TestWebSocket from "../components/TestSoket";
import MultiChainTokens from "../components/CrossChain";
import TokenWithSolanaBadge from "../components/TokenWithSolanaBadge";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

type TokenInfo = {
  mint: string;
  amount: number;
};

function LoggedIn() {
  const {
    ready,
    authenticated,
    logout,
    user,
    linkWallet,
    linkEmail,
    linkApple,
    linkDiscord,
    linkGithub,
    linkGoogle,
    linkPhone,
    linkTwitter,
    signMessage,
    sendTransaction,
  } = usePrivy();
  const { wallets } = useSolanaWallets();
  const router = useRouter();
  const [selectedLink, setSelectedLink] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<string>(""); // SOL 잔액 상태
  const [phantomWalletBalance, setPhantomWalletBalance] = useState<string>(""); // SOL 잔액 상태
  const connection = new Connection(clusterApiUrl("devnet"));
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [solBalance, setSolBalance] = useState(0);

  console.log("사용자:", user);

  const solwallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  const phantomSolwallet = wallets.find(
    (wallet) => wallet.walletClientType === "phantom"
  );

  const fetchAssets = async (address: string) => {
    try {
      // SOL 잔액
      console.log("address", address);
      const publicKey = new PublicKey(address);
      const lamports = await connection.getBalance(publicKey);
      setSolBalance(lamports / 1e9); // SOL 단위로 변환

      // SPL 토큰 계정들
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );
      console.log("tokenAccounts", tokenAccounts);
      const tokenList = tokenAccounts.value
        .map((tokenAccount) => {
          const info = tokenAccount.account.data.parsed.info;
          const mint = info.mint;
          const amount = info.tokenAmount.uiAmount;
          return { mint, amount };
        })
        // .filter((token) => token.amount > 0); // 잔액 0인 토큰은 제외

      setTokens(tokenList);
    } catch (err) {
      console.error("에셋 불러오기 오류:", err);
    }
  };

  useEffect(() => {
    if (phantomSolwallet) {
      fetchAssets(phantomSolwallet?.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phantomSolwallet]);

  useEffect(() => {
    if (!ready) {
      return;
    } else {
      setUp();
    }

    async function setUp() {
      const embeddedWallet = solwallet;
      const phantomWallet = phantomSolwallet;

      if (embeddedWallet) {
        // // Solana 연결 설정 필요에 따라 mainnet-beta로 변경
        const customRpcUrl = "https://api.testnet.sonic.game";
        const connection = new web3.Connection(customRpcUrl, "confirmed");

        // const connection = new web3.Connection(
        //   web3.clusterApiUrl("devnet"),
        //   "confirmed"
        // );

        // Solana 잔액 조회
        const balance = await connection.getBalance(
          new web3.PublicKey(embeddedWallet.address)
        );
        const solStringAmount = (balance / web3.LAMPORTS_PER_SOL).toString();

        setWalletBalance(solStringAmount);
      }

      if (phantomWallet) {
        const connection = new web3.Connection(
          web3.clusterApiUrl("devnet"),
          "confirmed"
        );
        const balance = await connection.getBalance(
          new web3.PublicKey(phantomWallet.address)
        );
        console.log("phantomWallet.address", phantomWallet.address);
        const solStringAmount = (balance / web3.LAMPORTS_PER_SOL).toString();

        setPhantomWalletBalance(solStringAmount);
      }
    }
  }, [phantomSolwallet, ready, solwallet, wallets]);

  if (ready && !authenticated) router.push("/");

  if (!user) return <></>;

  const linkOptions = [
    { label: "Email", action: linkEmail },
    { label: "Wallet", action: linkWallet },
    { label: "Apple", action: linkApple },
    { label: "Discord", action: linkDiscord },
    { label: "Github", action: linkGithub },
    { label: "Google", action: linkGoogle },
    { label: "Phone", action: linkPhone },
    { label: "Twitter", action: linkTwitter },
  ];

  const handleLinkClick = () => {
    const selected = linkOptions.find(
      (option) => option.label === selectedLink
    );
    if (selected) {
      selected.action();
    }
  };

  return (
    <div className="p-8">
      <p className="text-xl font-semibold">로그인됨</p>
      <p className="mb-4">사용자 {user.id}가 연결한 계정:</p>
      <ul className="list-inside list-disc mb-4">
        <li>이메일: {user.email ? user.email.address : "없음"}</li>
        <li>지갑: {user.wallet ? user.wallet.address : "없음"}</li>
        <li>구글: {user.google ? user.google.email : "없음"}</li>
        <li>디스코드: {user.discord ? user.discord.username : "없음"}</li>
        <li>트위터: {user.twitter ? user.twitter.username : "없음"}</li>
        <li>깃허브: {user.github ? user.github.username : "없음"}</li>
        <li>전화번호: {user.phone ? user.phone.number : "없음"}</li>
      </ul>
      <div className="mb-5">
        <select
          value={selectedLink}
          onChange={(e) => setSelectedLink(e.target.value)}
          className="border rounded mr-2 p-2"
        >
          <option>연결할 계정을 선택하세요</option>
          {linkOptions.map((option, index) => (
            <option key={index} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleLinkClick}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
        >
          선택한 계정 연결
        </button>
      </div>
      <p>내장 지갑 주소: {solwallet?.address}</p>
      {walletBalance && <p>잔액: {walletBalance} SONIC</p>}
      {phantomWalletBalance && <p>팬텀 잔액: {phantomWalletBalance} SOL</p>}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">📦 팬텀 지갑 보유 토큰</h2>
        <div className="flex flex-wrap gap-4">
          {tokens.map((token, idx) => (
            <div key={idx} className="w-24 text-center">
              <TokenWithSolanaBadge
                tokenSrc={
                  token.mint === "Es9vMFrzaCERZZHtxR7yXgVGC59X7hpA3b6ivE7c28yb"
                    ? "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                    : "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                }
                solanaSrc="https://cryptologos.cc/logos/solana-sol-logo.png"
                altToken={token.mint}
                altSolana="Solana Logo"
              />
              <p className="mt-1 text-sm truncate">
                {token.mint}
              </p>
              <p className="text-xs text-gray-500">{token.amount}</p>
            </div>
          ))}
          {tokens.length === 0 && (
            <p className="text-sm text-gray-400">보유 중인 SPL 토큰 없음</p>
          )}
        </div>
        <p className="mt-4 text-base font-medium">
          💰 팬텀 지갑 SOL 잔액 (getBalance): {solBalance.toFixed(4)} SOL
        </p>{" "}
      </div>
      <SignMessage user={user} />
      <SignMessageSol user={user} />
      <DelegateActionButton />
      <SendTransaction sendTransaction={sendTransaction} user={user} />
      <ConnectWithoutSignature />
      <RevokeDelegation />
      <WalletButton />
      <WalletCard />
      <GetSolBalanceButton />
      <FundWallet />
      <SendSolWithEmbeddedWallet />
      <SendTransactionExample
        senderWallet={solwallet}
        recipientAddress={phantomSolwallet?.address}
        lamports={0.01 * 1e9}
      />

      <TestWebSocket />
      <MultiChainTokens />
      <div className="w-20 h-20">
        <TokenWithSolanaBadge
          tokenSrc="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
          solanaSrc="https://cryptologos.cc/logos/solana-sol-logo.png"
          altToken="USDC Token"
          altSolana="Solana Logo"
        />
      </div>
      <div>
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default LoggedIn;
