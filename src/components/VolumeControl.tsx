'use client';

import { FC } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/lib/AudioProvider';

const VolumeControl: FC = () => {
  const { volume, muted, setVolume, toggleMute } = useAudio();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleMute}
        className="text-gray-400 hover:text-white"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted || volume === 0 ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={muted ? 0 : volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-24 h-2"
      />
    </div>
  );
};

export default VolumeControl;
