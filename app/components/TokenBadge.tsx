import TokenWithSolanaBadge from "./TokenWithSolanaBadge";

// Example token and Solana logo URLs (could be CDN links or local assets)
const usdcLogoUrl = "https://cryptach.org/crypto-logo/usd-coin-usdc-logo.png";
const solanaLogoUrl = "https://www.cryptach.org/crypto-logo/solana-sol-logo.png";

export function Example() {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Using default natural size of images */}
      <TokenWithSolanaBadge
        tokenSrc={usdcLogoUrl} 
        solanaSrc={solanaLogoUrl} 
        altToken="USDC Token (Devnet)" 
        altSolana="Solana network" 
      />

      {/* Explicitly controlling size with Tailwind classes for responsiveness */}
      <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32">
        <TokenWithSolanaBadge 
          tokenSrc={usdcLogoUrl} 
          solanaSrc={solanaLogoUrl} 
          altToken="USDC Token (Devnet)" 
          altSolana="Solana network" 
        />
      </div>
    </div>
  );
}
