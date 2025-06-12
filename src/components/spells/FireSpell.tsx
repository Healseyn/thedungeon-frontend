'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FireSpellProps {
  triggerKey: string | null; // mude a cada cast
}

export default function FireSpell({ triggerKey }: FireSpellProps) {
  /* ajustes rápidos */
  const TOTAL_MS  = 3500;  // animação completa
  const BALL_SIZE = 160;   // diâmetro da bola de fogo
  const RING_SIZE = 240;   // diâmetro do anel no impacto
  /* --------------- */

  const [visible, setVisible] = useState(false);
  const [center, setCenter]   = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!triggerKey) return;

    const tgt = document.querySelector('[data-monster-center]') as HTMLElement | null;
    if (!tgt) { console.warn('[FireSpell] target not found'); return; }

    const { left, top, width, height } = tgt.getBoundingClientRect();
    setCenter({ x: left + width / 2, y: top + height / 2 });

    setVisible(true);
    const t = setTimeout(() => setVisible(false), TOTAL_MS);
    return () => clearTimeout(t);
  }, [triggerKey]);

  if (!visible) return null;

  /* estilo base reutilizável */
  const ringBase = {
    position: 'fixed' as const,
    left: center.x,
    top:  center.y,
    borderRadius: '50%',
    pointerEvents: 'none' as const,
  };

  return (
    <>
      {/* Flash laranja --}}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.85, 0] }}
        transition={{ duration: 0.45, times: [0, 0.25, 1], ease: 'easeOut' }}
        className="fixed inset-0 z-[980] pointer-events-none"
        style={{ background: 'rgba(255,100,0,0.75)', mixBlendMode: 'screen' }}
      />

      {/* Bola de fogo – vem da esquerda e “encosta” no monstro */}
      <motion.div
        initial={{
          x: -BALL_SIZE * 2,
          y: center.y - BALL_SIZE / 2,
          scale: 0.9,
          opacity: 1,
        }}
        animate={{
          x: center.x - BALL_SIZE / 2,
          y: center.y - BALL_SIZE / 2,
          scale: [0.9, 1, 0.25],
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: 1.1,
          times: [0, 0.6, 1],
          ease: [0.3, 0.8, 0.4, 1],
        }}
        style={{
          position: 'fixed',
          width: BALL_SIZE,
          height: BALL_SIZE,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 40% 40%, #ffd36e 0%, #ff8c00 50%, #7c3000 100%)',
          boxShadow: '0 0 40px 14px rgba(255,120,0,0.9)',
          filter: 'brightness(110%)',
          pointerEvents: 'none',
          zIndex: 1001,
        }}
      />

      {/* Anel de chamas – expande e some */}
      <motion.span
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 4.2, opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.2, 0.7, 0.3, 1], delay: 0.55 }}
        style={{
          ...ringBase,
          width: RING_SIZE,
          height: RING_SIZE,
          marginLeft: -RING_SIZE / 2,
          marginTop:  -RING_SIZE / 2,
          border: '5px solid rgba(255,110,0,0.95)',
          filter: 'drop-shadow(0 0 18px rgba(255,110,0,0.9))',
          zIndex: 1000,
        }}
      />

      {/* Heat-shimmer (blur + fade) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 1.6, times: [0, 0.5, 1], ease: 'easeInOut', delay: 0.4 }}
        className="fixed inset-0 z-[979] pointer-events-none"
        style={{ backdropFilter: 'blur(2px) brightness(108%)' }}
      />
    </>
  );
}
