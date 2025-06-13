import { useEffect, useState } from 'react';
import Footer from './Footer';
import Image from 'next/image';

interface LaunchCountdownProps {
  launchAt: Date;
}

export default function LaunchCountdown({ launchAt }: LaunchCountdownProps) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = launchAt.getTime() - now.getTime();
  const totalSeconds = Math.max(Math.floor(diff / 1000), 0);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-dungeon-bg dungeon-atmosphere">
      <div className="space-y-6 max-w-md mx-4">
        <div className="flex justify-center">
          <Image src="/images/logo.png" alt="The Dungeon" width={96} height={96} priority draggable={false} />
        </div>
        <h1 className="text-4xl font-dungeon font-bold text-dungeon-gold glow-text">THE DUNGEON</h1>
        <p className="text-gray-300">A cooperative MMO clicker where players team up to defeat monsters and earn rewards on the Solana blockchain.</p>
        <div className="text-6xl font-mono text-white">{String(days).padStart(2,'0')}:{String(hours).padStart(2,'0')}:{String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}</div>
        <p className="text-gray-400">The game will launch soon. Join our Discord so you don't miss it!</p>
      </div>
      <div className="mt-10 w-full">
        <Footer isConnected={false} connectionError={null} />
      </div>
    </div>
  );
}
