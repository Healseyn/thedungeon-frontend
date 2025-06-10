'use client';

import { FC } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '../styles/wallet.css';

interface SolanaConnectProps {
  className?: string;
}

export const SolanaConnect: FC<SolanaConnectProps> = ({ className = '' }) => (
  <WalletMultiButton className={`wallet-btn ${className}`} />
);
