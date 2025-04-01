import {
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
  } from '@solana/web3.js';
  

  export async function sendSolTransaction(
    connection: Connection,
    senderWallet: any,
    recipientAddress: string,
    lamports: number
  ): Promise<string | null> {
    try {
      const senderPubKey = new PublicKey(senderWallet.address);
      const recipientPubKey = new PublicKey(recipientAddress);
      const { blockhash } = await connection.getLatestBlockhash();
  
      const transaction = new Transaction();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderPubKey;
  
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: senderPubKey,
          toPubkey: recipientPubKey,
          lamports,
        })
      );
  
      const signedTx = await senderWallet.signTransaction(transaction);

      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );

      return signature;
    } catch (error) {
      console.error('Error sending SOL transaction:', error);
      return null;
    }
  }
  