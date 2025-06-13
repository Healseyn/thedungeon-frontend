"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { Coins } from "lucide-react";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

interface TokenTransfer {
  id: number;
  wallet: string;
  amount: number;
  txId: string;
  createdAt: string;
}

interface TokenTransferHistoryProps {
  limit?: number;
}

const TokenTransferHistory: FC<TokenTransferHistoryProps> = ({ limit = 5 }) => {
  const [transfers, setTransfers] = useState<TokenTransfer[]>([]);

  const fetchTransfers = useCallback(async () => {
    try {
      const res = await fetch(
        `${SOCKET_URL}/api/game/token-transfers?limit=${limit}`,
      );
      if (res.ok) {
        const data = await res.json();
        setTransfers(data);
      }
    } catch (err) {
      console.error("Failed to fetch token transfers", err);
    }
  }, [limit]);

  useEffect(() => {
    fetchTransfers();
    const id = setInterval(fetchTransfers, 10000);
    return () => clearInterval(id);
  }, [fetchTransfers]);

  const formatAddr = (addr: string) =>
    addr.length <= 10 ? addr : `${addr.slice(0, 4)}…${addr.slice(-4)}`;

  return (
    <div className="bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border rounded-lg p-3 shadow-lg w-56 text-sm">
      <h3 className="text-lg font-dungeon font-bold text-dungeon-gold mb-3 flex items-center space-x-2 glow-text">
        <Coins className="w-5 h-5" />
        <span>Recent Airdrops</span>
      </h3>
      {transfers.length === 0 ? (
        <div className="text-gray-400 text-center py-4 text-sm">
          No token transfers yet...
        </div>
      ) : (
        <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar text-sm">
          {transfers.map((t) => (
            <div key={t.id} className="flex justify-between w-full px-1">
              <span className="text-gray-200 truncate">+{t.amount}</span>
              <span className="text-gray-400 font-mono" title={t.wallet}>
                {formatAddr(t.wallet)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenTransferHistory;
