'use client';

import { FC, useState } from 'react';
import { Copy, X, HelpCircle } from 'lucide-react';

interface Spell {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  damage: number;
  description: string;
}

const SPELL_ADDRESS = 'SPELL11111111111111111111111111111111111111';

const spells: Spell[] = [
  {
    id: 'meteor',
    name: 'Meteor Strike',
    emoji: '☄️',
    cost: 1000,
    damage: 50000,
    description: 'Deals 50,000 damage (does not count as your damage)'
  },
  {
    id: 'fireball',
    name: 'Fireball',
    emoji: '🔥',
    cost: 250,
    damage: 5000,
    description: 'Engulfs the boss in flames for 5,000 damage'
  },
  {
    id: 'bolt',
    name: 'Magic Bolt',
    emoji: '⚡',
    cost: 50,
    damage: 1000,
    description: 'Strikes for 1,000 damage'
  }
];

interface SpellSelectorProps {
  visible?: boolean;
}

const SpellSelector: FC<SpellSelectorProps> = ({ visible = true }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(SPELL_ADDRESS);
      setCopied('addr');
      setTimeout(() => setCopied(null), 1500);
    } catch (err) {
      console.error('Failed to copy spell address', err);
    }
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-24 md:bottom-28 z-50 flex flex-col items-center pointer-events-none transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {open && (
        <div className="pointer-events-auto w-full max-w-2xl mx-auto bg-dungeon-surface/95 backdrop-blur-md border-t border-dungeon-border rounded-t-lg shadow-2xl p-4 mb-2 transform transition-transform">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-dungeon font-bold text-dungeon-gold glow-text">Spells</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mb-4 text-xs text-gray-300">
            Send the spell cost to{' '}
            <span className="font-mono text-yellow-400">{SPELL_ADDRESS}</span>
            <button
              onClick={copyAddress}
              className="inline-flex items-center ml-2 space-x-1 text-gray-300 hover:text-white"
            >
              <Copy className="w-3 h-3" />
              <span>{copied === 'addr' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {spells.map(spell => (
              <div
                key={spell.id}
                className="bg-dungeon-surface border border-dungeon-border rounded-lg p-3 text-center space-y-1 hover:bg-dungeon-accent/50 transition-colors"
              >
                <div className="text-2xl">{spell.emoji}</div>
                <div className="font-bold text-dungeon-gold text-sm">{spell.name}</div>
                <div className="text-gray-400 text-xs">{spell.description}</div>
                <div className="text-xs text-gray-300">
                  Cost: <span className="text-yellow-400 font-bold">{spell.cost}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <div className="relative group">
              <HelpCircle className="w-5 h-5 text-gray-400 hover:text-white" />
              <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-72 bg-dungeon-surface border border-dungeon-border text-gray-300 text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition">
                Send tokens equal to the spell cost to the address above. Once received, the chosen spell will be cast on the boss. All spells share the same address.
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center space-x-2 pointer-events-auto mb-3">
        <button
          onClick={() => setOpen(o => !o)}
          className="bg-dungeon-surface/80 backdrop-blur-sm border border-dungeon-border rounded-full px-4 py-2 text-sm font-dungeon text-dungeon-gold shadow-lg hover:bg-dungeon-accent transition-colors"
        >
          {open ? 'Close Spells' : 'Open Spells'}
        </button>
      </div>
    </div>
  );
};

export default SpellSelector;
