'use client';

import { FC } from 'react';
import { createPortal } from 'react-dom';
import { X, Coins } from 'lucide-react';

interface TokenTransfer {
  id: number;
  wallet: string;
  amount: number;
  txId: string;
  createdAt: string;
}

interface TokenTransferModalProps {
  transfer: TokenTransfer;
  onClose: () => void;
}

const TokenTransferModal: FC<TokenTransferModalProps> = ({ transfer, onClose }) => {
  const formatAddr = (addr: string) =>
    addr.length <= 10 ? addr : `${addr.slice(0, 4)}…${addr.slice(-4)}`;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dungeon-surface/95 border-2 border-dungeon-border rounded-xl p-6 w-full max-w-md shadow-2xl">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-dungeon font-bold text-dungeon-gold mb-4 flex items-center space-x-2 glow-text">
          <Coins className="w-5 h-5" />
          <span>Token Airdrop</span>
        </h3>
        <div className="text-sm text-gray-300 space-y-2">
          <div>
            <span className="font-semibold text-gray-400">Amount:</span>{' '}
            <span className="text-yellow-400 font-mono">+{transfer.amount}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-400">Wallet:</span>{' '}
            <span className="text-gray-200">{formatAddr(transfer.wallet)}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-400">Time:</span>{' '}
            <span>{new Date(transfer.createdAt).toLocaleString()}</span>
          </div>
          <div className="break-all">
            <span className="font-semibold text-gray-400">TxID:</span>{' '}
            <a
              href={`https://solscan.io/tx/${transfer.txId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dungeon-gold underline break-all"
            >
              {transfer.txId}
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default TokenTransferModal;
