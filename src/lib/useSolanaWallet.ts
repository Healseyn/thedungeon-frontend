'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

export function useSolanaWallet() {
  const wallet = useWallet();

  const walletInfo = useMemo(() => {
    if (!wallet.connected || !wallet.publicKey) {
      return {
        connected: false,
        address: null,
        shortAddress: null,
      };
    }

    const address = wallet.publicKey.toBase58();
    const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

    return {
      connected: true,
      address,
      shortAddress,
    };
  }, [wallet.connected, wallet.publicKey]);

  return {
    ...wallet,
    ...walletInfo,
  };
}