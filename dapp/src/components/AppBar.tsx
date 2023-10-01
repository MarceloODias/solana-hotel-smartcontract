import { FC } from 'react';
import Link from "next/link";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const AppBar: FC = props => {
  return (
    <div>

    {/* NavBar / Header */}
    <div className="navbar flex flex-row md:mb-2 shadow-lg bg-neutral text-neutral-content">
      <div className="navbar-start">
        
      </div>

        {/* Nav Links */}
        <div className="hidden md:inline md:navbar-center">
          <div className="flex items-stretch">
            <Link href="/">
              <a className="btn btn-ghost btn-sm rounded-btn">Hotel Marketplace</a>
            </Link>
            {/* <Link href="/basics">
              <a className="btn btn-ghost btn-sm rounded-btn">Basics</a>
            </Link> */}
          </div>
        </div>

        {/* Wallet & Settings */}
        <div className="navbar-end">
          <WalletMultiButton />
        </div>
      </div>
      {props.children}
    </div>
  );
};

