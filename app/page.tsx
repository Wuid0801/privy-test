"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const {  ready, authenticated } = usePrivy();
  const router = useRouter();
  const { login } = useLogin();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);
  if (!ready) return <></>;

  if (ready && authenticated) router.push("/loggedin");

  return (
    <main className="p-8 text-center">
       <button
            disabled={disableLogin}
            onClick={() => login({
                loginMethods: ['wallet','twitter'],
                walletChainType: 'ethereum-and-solana',
                disableSignup: false
            })}
        >
            Log in
        </button>
      <h1 className="text-2xl font-semibold mb-4">
        Privy Embedded Wallet Demo
      </h1>
      <button
        onClick={login}
        className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
      >
        Log in
      </button>
    </main>
  );
}
