'use client';

import { FC } from 'react';
import VolumeControl from './VolumeControl';
import DiscordIcon from './icons/DiscordIcon';
import PumpFunIcon from './icons/PumpFunIcon';
import GitbookIcon from './icons/GitbookIcon';
import GithubIcon from './icons/GithubIcon';
import TwitterIcon from './icons/TwitterIcon';

interface FooterProps {
  isConnected: boolean;
  connectionError: string | null;
  onlineCount?: number;
}

const Footer: FC<FooterProps> = ({
  isConnected,
  connectionError,
  onlineCount = 0
}) => (
  <footer className="fixed bottom-0 left-0 right-0 bg-dungeon-surface/95 backdrop-blur-sm border-t border-dungeon-border z-40">
    <div className="flex flex-col md:flex-row items-center px-2 md:px-4 py-2 md:py-3 space-y-1 md:space-y-0">
      {/* Connection Status */}
      <div className="flex items-center space-x-2 flex-1">
        <div
          className={`w-2 h-2 rounded-full ${connectionError
              ? 'bg-red-500'
              : isConnected
                ? 'bg-green-400 animate-pulse'
                : 'bg-yellow-400 animate-pulse'
            }`}
        />
        <span className="text-xs md:text-sm font-medium text-white">
          {connectionError ? 'Disconnected' : isConnected ? 'Online' : 'Connecting…'}
        </span>
        <span className="text-xs md:text-sm font-medium text-gray-400 ml-4">
          warriors online {onlineCount}
        </span>
      </div>

      {/* Game Title */}
      <div className="text-center flex-1">
        <h2 className="text-base md:text-lg font-dungeon font-bold text-dungeon-gold glow-text">
          THE DUNGEON
        </h2>
      </div>

      {/* Controls & Links */}
      <div className="flex items-center justify-end space-x-4 flex-1">
        <VolumeControl />
        <div className="text-sm text-gray-400">v0.1.2-BETA</div>

        {/* Pump.fun */}
        <a
          href="https://pump.fun/coin/ChyaLf1QEDymfLaWMEvm4Uv6km3LfEY2Lrm1QzMspump"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pump.fun"
          className="hover:opacity-90 transition-opacity"
        >
          <PumpFunIcon size={20} />
        </a>

        {/* Discord */}
        <a
          href="https://discord.gg/E6RuWBrww3"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord"
          className="hover:text-white text-gray-400"
        >
          <DiscordIcon className="w-5 h-5" />
        </a>

        {/* GitBook Docs */}
        <a
          href="https://docs.thedungeon.fun"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Docs"
          className="hover:text-white text-gray-400"
        >
          <GitbookIcon className="w-5 h-5" />
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/Healseyn/Thedungeon-frontend"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Docs"
          className="hover:text-white text-gray-400"
        >
          <GithubIcon className="w-5 h-5" />
        </a>

        {/* Twitter */}
        <a
          href="https://x.com/Thedungeon_fun"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Docs"
          className="hover:text-white text-gray-400"
        >
          <TwitterIcon className="w-5 h-5" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
