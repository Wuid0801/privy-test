import React from 'react';
import { Connection } from '@solana/web3.js';
import { sendSolTransaction } from './solanaUtils';
interface SendTransactionProps {
    senderWallet: any;
    recipientAddress: any;
    lamports: number;
  }
function SendTransactionExample({ senderWallet,recipientAddress, lamports}: SendTransactionProps ) {
  const connection = new Connection('https://api.devnet.solana.com');

  const handleSend = async () => {


    const signature = await sendSolTransaction(
      connection,
      senderWallet,
      recipientAddress,
      lamports
    );

    if (signature) {
      console.log('Transaction signature:', signature);
    } else {
      console.error('Transaction failed.');
    }
  };

  return (
    <button onClick={handleSend} className="px-4 py-2 bg-blue-500 text-white rounded">
      Send 0.01 SOL
    </button>
  );
}

export default SendTransactionExample;
