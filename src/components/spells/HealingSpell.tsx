'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HealingSpellProps {
  triggerKey: string | null;   // troque o valor (timestamp / uuid) a cada cast
}

export default function HealingSpell({ triggerKey }: HealingSpellProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const DURATION = 2200; // toda a animação

  useEffect(() => {
    if (!triggerKey) return;

    const target = document.querySelector('[data-monster-center]') as HTMLElement | null;
    if (!target) {
      console.warn('[HealingSpell] [data-monster-center] not found.');
      return;
    }
    const { left, top, width, height } = target.getBoundingClientRect();
    setPos({ x: left + width / 2, y: top + height / 2 });

    setVisible(true);
    const t = setTimeout(() => setVisible(false), DURATION);
    return () => clearTimeout(t);
  }, [triggerKey]);

  if (!visible) return null;

  const rings = [0, 1, 2]; // três anéis

  return (
    <>
      {/* Radial flash: fade-in (0 → 0.35) e fade-out (0.35 → 0) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.35, 0] }}
        transition={{
          duration: 1.8,           // total do flash
          times:    [0, 0.15, 1],  // 15 % rápido p/ aparecer, resto p/ sumir
          ease: 'easeOut'
        }}
        style={{
          background:
            'radial-gradient(circle, rgba(0,255,140,0.3) 0%, rgba(0,0,0,0) 70%)',
        }}
        className="fixed inset-0 z-[998] pointer-events-none"
      />

      {/* Anéis expansivos */}
      <AnimatePresence>
        {rings.map(i => (
          <motion.span
            key={i}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{
              scale: 4,
              opacity: 0,
              transition: {
                duration: 1.2,
                ease: [0.2, 0.65, 0.3, 0.9],
                delay: i * 0.2,
              },
            }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              left: pos.x,
              top: pos.y,
              width: 120,
              height: 120,
              marginLeft: -60,
              marginTop: -60,
              borderRadius: '50%',
              border: '6px solid rgba(0,255,140,0.75)',
              boxShadow: '0 0 16px 4px rgba(0,255,140,0.5)',
              pointerEvents: 'none',
              zIndex: 999,
            }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
