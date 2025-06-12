'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoidSigilSpellProps {
  /** Passe um valor diferente (timestamp, UUID…) a cada cast */
  triggerKey: string | null;
}

export default function VoidSigilSpell({ triggerKey }: VoidSigilSpellProps) {
  /* -------- parâmetros fáceis de ajustar -------- */
  const TOTAL_MS = 6000;   // duração total (~6 s)
  const SIZE     = 260;    // diâmetro base do sigilo
  /* ---------------------------------------------- */

  const [visible, setVisible] = useState(false);
  const [pos, setPos]         = useState({ x: 0, y: 0 });

  /* localizar o centro do monstro e iniciar animação */
  useEffect(() => {
    if (!triggerKey) return;

    const tgt = document.querySelector('[data-monster-center]') as HTMLElement | null;
    if (!tgt) { console.warn('[VoidSigilSpell] target not found'); return; }

    const { left, top, width, height } = tgt.getBoundingClientRect();
    setPos({ x: left + width / 2, y: top + height / 2 });

    setVisible(true);
    const t = setTimeout(() => setVisible(false), TOTAL_MS);
    return () => clearTimeout(t);
  }, [triggerKey]);

  if (!visible) return null;

  /* estilo base reutilizado pelos anéis / onda */
  const ringBase = {
    position: 'fixed' as const,
    left: pos.x,
    top:  pos.y,
    width: SIZE,
    height: SIZE,
    marginLeft: -SIZE / 2,
    marginTop:  -SIZE / 2,
    borderRadius: '50%',
    pointerEvents: 'none' as const,
    zIndex: 1002,
  };

  return (
    <>
      {/* 1. Escurecimento + desaturação */}
      <motion.div
        initial={{ backdropFilter: 'grayscale(0%) brightness(100%)', opacity: 0 }}
        animate={{
          backdropFilter: [
            'grayscale(0%) brightness(100%)',
            'grayscale(80%) brightness(60%)',
            'grayscale(80%) brightness(60%)',
            'grayscale(0%) brightness(100%)',
          ],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 5.2, times: [0, 0.08, 0.85, 1], ease: 'easeInOut' }}
        className="fixed inset-0 z-[980] pointer-events-none"
        style={{ background: 'rgba(10,0,30,0.65)', mixBlendMode: 'multiply' }}
      />

      {/* 2. Pilar arcano descendente */}
      <motion.div
        initial={{ height: 0, opacity: 1 }}
        animate={{ height: pos.y, opacity: [1, 0.8, 0] }}
        transition={{ duration: 1.1, ease: 'easeOut', delay: 0.4 }}
        style={{
          position: 'fixed',
          left: pos.x - 8,
          top: 0,
          width: 16,
          background: 'linear-gradient(180deg,#9129ff 0%,#551a9c 60%,transparent 100%)',
          filter: 'drop-shadow(0 0 12px #9129ff)',
          pointerEvents: 'none',
          zIndex: 1001,
        }}
      />

      <AnimatePresence>
        {/* 3a. Anel externo rúnico */}
        <motion.span
          key="outer"
          initial={{ scale: 0.3, rotate: 0, opacity: 0 }}
          animate={{
            scale: [0.3, 1.2, 1, 1],
            rotate: 360,
            opacity: [0, 1, 0.9, 0],   // fade-out
          }}
          exit={{ opacity: 0 }}
          transition={{
            times: [0, 0.3, 0.75, 1],
            duration: 3.2,
            ease: [0.2, 0.8, 0.4, 1],
            delay: 0.6,
          }}
          style={{
            ...ringBase,
            border: '6px solid rgba(145,41,255,0.9)',
            boxShadow: '0 0 18px 4px rgba(145,41,255,0.6)',
            backdropFilter: 'blur(1px)',
          }}
        />

        {/* 3b. Anel interno tracejado */}
        <motion.span
          key="inner"
          initial={{ scale: 0.2, rotate: 0, opacity: 0 }}
          animate={{
            scale: [0.2, 0.7, 0.6, 0.6],
            rotate: -360,
            opacity: [0, 1, 0.9, 0],  // fade-out
          }}
          exit={{ opacity: 0 }}
          transition={{
            times: [0, 0.3, 0.75, 1],
            duration: 3.0,
            ease: [0.2, 0.8, 0.4, 1],
            delay: 0.6,
          }}
          style={{
            ...ringBase,
            width: SIZE * 0.65,
            height: SIZE * 0.65,
            marginLeft: -(SIZE * 0.325),
            marginTop:  -(SIZE * 0.325),
            border: '4px dashed rgba(175,110,255,0.9)',
            boxShadow: '0 0 14px 2px rgba(175,110,255,0.6)',
          }}
        />
      </AnimatePresence>

      {/* 4. Núcleo pulsante */}
      <motion.span
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{
          scale: [0, 1, 0.85, 1.1, 0],
          opacity: [0.9, 1, 0.8, 0.9, 0],
        }}
        transition={{
          duration: 4.0,
          times: [0, 0.25, 0.45, 0.7, 1],
          ease: 'easeInOut',
          delay: 0.8,
        }}
        style={{
          position: 'fixed',
          left: pos.x,
          top:  pos.y,
          width:  90,
          height: 90,
          marginLeft: -45,
          marginTop:  -45,
          borderRadius: '50%',
          background: 'radial-gradient(circle,#4e0aff 0%,#6513ff 50%,#220055 100%)',
          boxShadow: '0 0 25px 8px rgba(90,30,255,0.8)',
          pointerEvents: 'none',
          zIndex: 1004,
        }}
      />

      {/* 5. Onda de choque final */}
      <motion.span
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 5, opacity: 0 }}
        transition={{
          duration: 1.8,
          ease: [0.2, 0.7, 0.3, 1],
          delay: 2.6,
        }}
        style={{
          ...ringBase,
          border: '4px solid rgba(140,60,255,0.85)',
          filter: 'drop-shadow(0 0 18px rgba(140,60,255,0.9))',
          zIndex: 1000,
        }}
      />
    </>
  );
}
