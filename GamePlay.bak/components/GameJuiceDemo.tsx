import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameJuice } from '../hooks/useGameJuice';
import { ShakeContainer, ShakeContainerRef, ShakeIntensity } from './ShakeContainer';
import { FlashOverlay, MultiFlashOverlay, ShockwaveEffect, FlashType } from './FlashOverlay';

/**
 * GameJuiceDemo - Demo komponen untuk menunjukkan cara penggunaan
 * 
 * Copy paste code dari sini ke game Anda!
 */
export const GameJuiceDemo: React.FC = () => {
  const juice = useGameJuice();
  const gameContainerRef = useRef<ShakeContainerRef>(null);
  
  // State untuk flash overlays
  const [activeFlash, setActiveFlash] = useState<{ type: FlashType; active: boolean } | null>(null);
  const [multiFlashActive, setMultiFlashActive] = useState(false);
  const [shockwave, setShockwave] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  // Handler untuk shake dengan ref
  const handleShake = (intensity: ShakeIntensity) => {
    gameContainerRef.current?.shake(intensity);
  };

  // Handler untuk flash
  const handleFlash = (type: FlashType) => {
    setActiveFlash({ type, active: true });
    setTimeout(() => setActiveFlash(null), 500);
  };

  // Handler untuk multi flash
  const handleMultiFlash = () => {
    setMultiFlashActive(true);
    setTimeout(() => setMultiFlashActive(false), 1500);
  };

  // Handler untuk shockwave
  const handleShockwave = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setShockwave({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    });
    setTimeout(() => setShockwave(prev => ({ ...prev, active: false })), 700);
  };

  return (
    <ShakeContainer ref={gameContainerRef} className="min-h-screen bg-zinc-900 p-8">
      {/* Flash Overlays */}
      {activeFlash && (
        <FlashOverlay
          isActive={activeFlash.active}
          type={activeFlash.type}
          opacity={0.5}
        />
      )}
      
      {multiFlashActive && (
        <MultiFlashOverlay
          flashes={[
            { type: 'gold', delay: 0, opacity: 0.6 },
            { type: 'white', delay: 150, opacity: 0.3 },
            { type: 'gold', delay: 300, opacity: 0.5 }
          ]}
          onComplete={() => setMultiFlashActive(false)}
        />
      )}

      {shockwave.active && (
        <ShockwaveEffect
          originX={shockwave.x}
          originY={shockwave.y}
          isActive={true}
          size={400}
          color="#ffd700"
        />
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🎮 Game Juice System Demo
        </h1>

        {/* Section 1: Screen Shake */}
        <section className="mb-8 p-6 bg-zinc-800 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">📳 Screen Shake</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleShake('light')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Light Shake
            </button>
            <button
              onClick={() => handleShake('medium')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Medium Shake
            </button>
            <button
              onClick={() => handleShake('heavy')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Heavy Shake
            </button>
            <button
              onClick={() => handleShake('extreme')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Extreme Shake
            </button>
            <button
              onClick={() => gameContainerRef.current?.shakeSequence(['light', 'medium', 'heavy'])}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Sequence Shake
            </button>
          </div>
        </section>

        {/* Section 2: Flash Effects */}
        <section className="mb-8 p-6 bg-zinc-800 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">⚡ Flash Effects</h2>
          <div className="flex flex-wrap gap-3">
            {(['white', 'gold', 'red', 'green', 'purple', 'blue'] as FlashType[]).map(type => (
              <button
                key={type}
                onClick={() => handleFlash(type)}
                className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition capitalize"
              >
                {type} Flash
              </button>
            ))}
            <button
              onClick={handleMultiFlash}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
            >
              Multi Flash (Win)
            </button>
          </div>
        </section>

        {/* Section 3: Hook-based Effects */}
        <section className="mb-8 p-6 bg-zinc-800 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">🪝 useGameJuice Hook</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => juice.winCelebration(false)}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Win (Normal)
            </button>
            <button
              onClick={() => juice.winCelebration(true)}
              className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Win (Big)
            </button>
            <button
              onClick={() => juice.lossImpact(false)}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Loss (Normal)
            </button>
            <button
              onClick={() => juice.lossImpact(true)}
              className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Loss (Critical)
            </button>
            <button
              onClick={juice.jokerTrigger}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Joker Trigger
            </button>
            <button
              onClick={juice.bossAppear}
              className="px-4 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition"
            >
              Boss Appear
            </button>
            <button
              onClick={juice.levelUp}
              className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
            >
              Level Up
            </button>
            <button
              onClick={juice.blackjackCelebration}
              className="px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
            >
              Blackjack!
            </button>
            <button
              onClick={juice.bustEffect}
              className="px-4 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
            >
              Bust
            </button>
          </div>
        </section>

        {/* Section 4: Shockwave */}
        <section className="mb-8 p-6 bg-zinc-800 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">💥 Shockwave Effect</h2>
          <p className="text-gray-400 mb-4">Click anywhere in the box below:</p>
          <div 
            onClick={handleShockwave}
            className="h-48 bg-zinc-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-zinc-600 transition relative overflow-hidden"
          >
            <span className="text-white text-lg">Click me!</span>
          </div>
        </section>

        {/* Section 5: Integration Example */}
        <section className="mb-8 p-6 bg-zinc-800 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">🎯 Integration Example</h2>
          <div className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm text-green-400">
{`// 1. Wrap your game dengan ShakeContainer
import { ShakeContainer } from './components/ShakeContainer';
import { useGameJuice } from './hooks/useGameJuice';

function Game() {
  const gameRef = useRef<ShakeContainerRef>(null);
  const juice = useGameJuice();

  // 2. Trigger effects saat event game
  const handleWin = (isBigWin: boolean) => {
    juice.winCelebration(isBigWin);
  };

  const handleJokerTrigger = () => {
    juice.jokerTrigger();
  };

  return (
    <ShakeContainer ref={gameRef} id="game-container">
      {/* Your game content */}
    </ShakeContainer>
  );
}`}
            </pre>
          </div>
        </section>
      </div>
    </ShakeContainer>
  );
};

export default GameJuiceDemo;
