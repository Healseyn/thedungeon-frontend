'use client';

import { FC, useEffect, useState } from 'react';
import { Gift } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useSocket } from '@/lib/useSocket';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

interface PendingReward {
  id: number;
  wallet: string;
  amount: number;
  spawnId: string;
  createdAt: string;
}

interface TokenReward {
  id: number;
  wallet: string;
  amount: number;
  txId: string;
  createdAt: string;
}

const RecentRewardsModal: FC<{ wallet: string; onClose: () => void }> = ({ wallet, onClose }) => {
  const [rewards, setRewards] = useState<TokenReward[]>([]);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await fetch(`${SOCKET_URL}/api/players/${wallet}/token-rewards?limit=10`);
        if (res.ok) {
          const data: TokenReward[] = await res.json();
          setRewards(data);
        }
      } catch (err) {
        console.error('Failed to fetch rewards history', err);
      }
    };
    fetchRewards();
  }, [wallet]);

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dungeon-surface/95 border-2 border-dungeon-border rounded-xl p-6 w-full max-w-sm shadow-2xl">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">
          ✕
        </button>
        <h3 className="text-lg font-dungeon font-bold text-dungeon-gold mb-4 flex items-center space-x-2 glow-text">
          <Gift className="w-5 h-5" />
          <span>Recent Rewards</span>
        </h3>
        {rewards.length === 0 ? (
          <div className="text-gray-400 text-center py-4 text-sm">No rewards yet...</div>
        ) : (
          <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar text-sm">
            {rewards.map(r => (
              <div key={r.id} className="flex justify-between w-full px-1">
                <span className="text-yellow-400 font-mono">+{r.amount}</span>
                <span className="text-gray-400" title={r.createdAt}>{new Date(r.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

const PendingRewardsBubble: FC = () => {
  const { walletAddress } = useSocket();
  const [pending, setPending] = useState<PendingReward[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${SOCKET_URL}/api/players/${walletAddress}/pending-rewards`);
        if (res.ok) {
          const data: PendingReward[] = await res.json();
          if (mounted) setPending(data);
        }
      } catch (err) {
        console.error('Failed to fetch pending rewards', err);
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [walletAddress]);

  if (!walletAddress) return null;

  const count = pending.length;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 left-4 z-50 bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border rounded-full w-10 h-10 flex items-center justify-center text-dungeon-gold shadow-lg md:bottom-28"
      >
        <div className="relative">
          <Gift className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full px-1 leading-none">
              {count}
            </span>
          )}
        </div>
      </button>
      {showModal && walletAddress && (
        <RecentRewardsModal wallet={walletAddress} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default PendingRewardsBubble;
