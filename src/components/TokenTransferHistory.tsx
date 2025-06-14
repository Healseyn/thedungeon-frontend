"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { Coins } from "lucide-react";
import TokenTransferModal from "./TokenTransferModal";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

/* ──────────────── Types ──────────────── */
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

/* Format numbers:
   - Always round down (floor)
   - No decimals
   - Abbreviate ≥ 100 000 as k, ≥ 1 000 000 as m         */
const formatAmount = (amount: number | string) => {
  const val = Math.floor(Number(amount));

  if (val >= 1_000_000) return `${Math.floor(val / 1_000_000)}m`;
  if (val >= 100_000)  return `${Math.floor(val / 1_000)}k`;

  return val.toString(); // For values < 100 000
};

const TokenTransferHistory: FC<TokenTransferHistoryProps> = ({ limit = 5 }) => {
  const [transfers, setTransfers] = useState<TokenTransfer[]>([]);
  const [selected, setSelected] = useState<TokenTransfer | null>(null);

  /* Fetch recent transfers from the backend */
  const fetchTransfers = useCallback(async () => {
    try {
      const res = await fetch(
        `${SOCKET_URL}/api/game/token-transfers?limit=${limit}`,
      );
      if (res.ok) {
        const data = await res.json();
        setTransfers(data.slice(0, limit));
      }
    } catch (err) {
      console.error("Failed to fetch token transfers", err);
    }
  }, [limit]);

  /* Initial fetch + refresh every 3 minutes */
  useEffect(() => {
    fetchTransfers();
    const id = setInterval(fetchTransfers, 180000);
    return () => clearInterval(id);
  }, [fetchTransfers]);

  /* Shorten long Solana addresses */
  const formatAddr = (addr: string) =>
    addr.length <= 10 ? addr : `${addr.slice(0, 4)}…${addr.slice(-4)}`;

  return (
    <div className="bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border rounded-lg p-3 shadow-lg w-56 text-sm">
      <h3 className="text-lg font-dungeon font-bold text-dungeon-gold mb-3 flex items-center space-x-2 glow-text">
        <Coins className="w-5 h-5" />
        <span>Recent Airdrops</span>
      </h3>

      {transfers.length === 0 ? (
        /* Empty state */
        <div className="text-gray-400 text-center py-4 text-sm">
          No token transfers yet...
        </div>
      ) : (
        /* Transfer list */
        <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar text-sm">
          {transfers.map(t => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className="flex justify-between w-full hover:bg-dungeon-accent/40 rounded px-1"
            >
              <span className="text-gray-200 truncate">
                +{formatAmount(t.amount)}
              </span>
              <span className="text-gray-400 font-mono" title={t.wallet}>
                {formatAddr(t.wallet)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Modal with transfer details */}
      {selected && (
        <TokenTransferModal
          transfer={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default TokenTransferHistory;
