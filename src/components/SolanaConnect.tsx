'use client';

import { FC } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSolanaWallet } from '@/lib/useSolanaWallet';

interface SolanaConnectProps {
  className?: string;
}

export const SolanaConnect: FC<SolanaConnectProps> = ({ className = '' }) => {
  const { connected, shortAddress } = useSolanaWallet();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {connected && shortAddress && (
        <div className="hidden md:flex items-center bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border rounded-lg px-3 py-2 mr-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm font-medium text-white">
            {shortAddress}
          </span>
        </div>
      )}

      <WalletMultiButton 
        className="!bg-dungeon-primary hover:!bg-dungeon-secondary !border !border-dungeon-border !rounded-lg !text-white !font-medium !px-4 !py-2 !text-sm !transition-all !duration-200 !h-auto"
      />
    </div>
  );
};