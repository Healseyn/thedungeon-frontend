'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextProps {
  playEffect: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  volume: number;
  muted: boolean;
}

const AudioContext = createContext<AudioContextProps>({
  playEffect: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  volume: 1,
  muted: false,
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const effectRef = useRef<HTMLAudioElement | null>(null);

  // load saved settings
  useEffect(() => {
    const savedVol = localStorage.getItem('volume');
    const savedMute = localStorage.getItem('muted');
    if (savedVol !== null) setVolumeState(parseFloat(savedVol));
    if (savedMute !== null) setMuted(savedMute === 'true');
  }, []);

  // initialize audio elements
  useEffect(() => {
    musicRef.current = new Audio('/audio/gamemusic.mp3');
    musicRef.current.loop = true;
    musicRef.current.volume = volume;

    effectRef.current = new Audio('/audio/monster-hit.mp3');
    effectRef.current.volume = volume;

    if (!muted) {
      musicRef.current.play().catch(() => {});
    }

    return () => {
      musicRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('volume', volume.toString());
    if (musicRef.current) musicRef.current.volume = volume;
    if (effectRef.current) effectRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('muted', muted.toString());
    if (musicRef.current) {
      if (muted) {
        musicRef.current.pause();
      } else {
        musicRef.current.play().catch(() => {});
      }
    }
  }, [muted]);

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (v > 0 && muted) setMuted(false);
  };

  const playEffect = () => {
    const el = effectRef.current;
    if (!el || muted) return;
    el.currentTime = 0;
    el.play().catch(() => {});
    // ensure music starts after user interaction
    if (musicRef.current && !muted) {
      musicRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => setMuted(m => !m);

  return (
    <AudioContext.Provider value={{ playEffect, setVolume, toggleMute, volume, muted }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
