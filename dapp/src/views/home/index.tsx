// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import pkg from '../../../package.json';
import { RequestAirdrop } from '../../components/RequestAirdrop';
import { SendTransaction } from '../../components/SendTransaction';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';


export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  
  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
       

        <img src="https://res.cloudinary.com/nomah/f_auto,w_360,q_90/units/SABI/complex/1_SABI-STD-FOLK-30-PL_hc2oue.jpg" alt="Logo" />
        <h1 className="text-center text-3xl md:pl-12 font-bold  bg-clip-text bg-gradient-to-tr from-[#FFF] to-[#FFF]">
          $0.500 (SOL) per night 
        </h1> 
        <div className="text-center">
          {wallet.publicKey && <p>Public Key: {wallet.publicKey.toBase58()}</p>}
          {wallet && <p>SOL Balance: {(balance || 0).toLocaleString()}</p>}
          <SendTransaction />
        </div>
      </div>
    </div>
  );
};
