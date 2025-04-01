/* eslint-disable @next/next/no-img-element */
import React from "react";

const TokenWithSolanaBadge = ({
  tokenSrc, // 토큰 이미지 URL
  solanaSrc, // Solana 로고 이미지 URL
  altToken = "Token",
  altSolana = "Solana logo",
}) => {
  return (
    <div className="relative inline-block">
      {/* 토큰 이미지 */}
      <img src={tokenSrc} alt={altToken} className="block w-full h-auto" />
      {/* 오른쪽 하단에 겹쳐진 Solana 로고 */}
      <img
        src={solanaSrc}
        alt={altSolana}
        className="absolute bottom-0 right-0 w-1/4 h-auto object-contain"
      />
    </div>
  );
};

export default TokenWithSolanaBadge;
