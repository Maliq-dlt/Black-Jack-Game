import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TableTheme, GameSettings, MetaProgression, PrestigeUpgrades } from '../types';

interface LandingScreenProps {
  onPlay: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  meta: MetaProgression;
  onUpdateMeta: (meta: MetaProgression) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onPlay, onOpenSettings, onOpenStats, meta, onUpdateMeta }) => {
  const [isPrestigeOpen, setIsPrestigeOpen] = useState(false);

  const availablePoints = meta.totalPrestigePoints - meta.spentPrestigePoints;

  const handleUpgrade = (type: keyof PrestigeUpgrades, cost: number, increment: number) => {
    if (availablePoints >= cost) {
      const newUpgrades = { ...meta.upgrades, [type]: meta.upgrades[type] + increment };
      onUpdateMeta({
        ...meta,
        spentPrestigePoints: meta.spentPrestigePoints + cost,
        upgrades: newUpgrades
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden text-[#e2d1b0] font-serif">
      {/* Animated Ominous Mist */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#3a0a0a] rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#1a231a] rounded-full blur-[150px] animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-center relative z-10"
      >
        <h2 className="text-xl md:text-2xl font-serif text-[#8b0000] tracking-[0.5em] mb-2 uppercase italic opacity-60 font-['Special_Elite']">DEAL WITH THE</h2>
        <h1 className="text-6xl md:text-9xl font-serif font-black tracking-tighter text-[#e2d1b0] mb-8 uppercase" style={{ textShadow: '4px 4px 0px #000' }}>
          ROYALE<br/><span className="text-[#8b0000] font-['Special_Elite']">ROGUE</span>
        </h1>
        
        <div className="flex flex-col gap-6 items-center">
          <motion.button
            whileHover={{ scale: 1.05, border: '2px solid #8b0000', color: '#fff' }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlay}
            className="w-72 py-5 bg-black/40 border-2 border-[#8b0000]/40 text-[#8b0000] text-3xl font-black tracking-[0.2em] transition-all shadow-2xl relative overflow-hidden group font-['Special_Elite']"
          >
            <span className="relative z-10">ENTER ROOM</span>
            <div className="absolute inset-0 bg-[#8b0000]/10 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-300 ease-in-out" />
          </motion.button>
          
          <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05, color: "#fff" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPrestigeOpen(true)}
                className="w-32 py-3 rounded-full border-2 border-purple-500/40 hover:border-purple-500 text-purple-400 font-bold tracking-widest transition-all text-xs"
              >
                PRESTIGE
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, color: "#fff" }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenSettings}
                className="w-32 py-3 rounded-full border-2 border-white/20 hover:border-white/50 text-white/70 font-bold tracking-widest transition-all text-xs"
              >
                SETTINGS
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, color: "#fff" }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenStats}
                className="w-32 py-3 rounded-full border-2 border-green-500/40 hover:border-green-500 text-green-400 font-bold tracking-widest transition-all text-xs"
              >
                STATS
              </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Prestige Shop Modal */}
      <AnimatePresence>
        {isPrestigeOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrestigeOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-purple-500/30 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                  <svg className="w-32 h-32 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
              </div>

              <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-white tracking-wider">PRESTIGE HALL</h2>
                    <p className="text-purple-400 font-mono text-sm uppercase tracking-widest">Permanent Upgrades</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Available Points</p>
                    <p className="text-3xl font-black text-purple-500">{availablePoints}</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                {/* Upgrade Items */}
                {[
                    { 
                        id: 'cash', 
                        name: 'Investor Backing', 
                        desc: 'Start every run with extra cash', 
                        val: `$${meta.upgrades.extraStartingCash}`, 
                        cost: 10, 
                        inc: 500, 
                        type: 'extraStartingCash' as keyof PrestigeUpgrades 
                    },
                    { 
                        id: 'wild', 
                        name: 'Fate Weaver', 
                        desc: 'Permanent increase to Wild Card chance', 
                        val: `+${(meta.upgrades.increasedWildChance * 100).toFixed(0)}%`, 
                        cost: 25, 
                        inc: 0.05, 
                        type: 'increasedWildChance' as keyof PrestigeUpgrades 
                    },
                    { 
                        id: 'slots', 
                        name: 'Utility Belt', 
                        desc: 'Bonus inventory slots (Limited)', 
                        val: `${meta.upgrades.bonusInventorySlots} slots`, 
                        cost: 50, 
                        inc: 1, 
                        type: 'bonusInventorySlots' as keyof PrestigeUpgrades 
                    },
                ].map((item) => (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:border-purple-500/40 transition-colors">
                        <div className="flex-grow">
                            <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">{item.name}</h3>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                            <p className="text-sm font-black text-white/40 mt-1 uppercase">Current: {item.val}</p>
                        </div>
                        <button
                            onClick={() => handleUpgrade(item.type, item.cost, item.inc)}
                            disabled={availablePoints < item.cost}
                            className={`px-6 py-2 rounded-xl font-black transition-all ${availablePoints >= item.cost ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg' : 'bg-zinc-800 text-gray-600 cursor-not-allowed'}`}
                        >
                            {item.cost} PT
                        </button>
                    </div>
                ))}
              </div>

              <button 
                onClick={() => setIsPrestigeOpen(false)}
                className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl tracking-widest border border-white/10"
              >
                CLOSE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer / Branding */}
      <div className="absolute bottom-8 text-white/20 text-xs tracking-widest flex items-center gap-4">
        <span>EST. 2024</span>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <span>V 2.0 PREMIUM</span>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <span>POWERED BY AI</span>
      </div>
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white tracking-wider">SETTINGS</h2>
              <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-8">
              {/* Volume */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                  <span>MASTER VOLUME</span>
                  <span className="text-white">{Math.round(settings.volume * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01"
                  value={settings.volume}
                  onChange={(e) => onUpdateSettings({ ...settings, volume: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                />
              </div>

              {/* Dealer Voice */}
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white tracking-wide">DEALER VOICE</div>
                  <div className="text-xs text-gray-400">Hear AI commentary text-to-speech</div>
                </div>
                <button 
                  onClick={() => onUpdateSettings({ ...settings, isVoiceEnabled: !settings.isVoiceEnabled })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${settings.isVoiceEnabled ? 'bg-yellow-600' : 'bg-zinc-700'}`}
                >
                  <motion.div 
                    animate={{ x: settings.isVoiceEnabled ? 24 : 0 }}
                    className="w-4 h-4 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>

              {/* Table Themes */}
              <div className="space-y-4">
                <div className="text-sm font-bold text-white tracking-wide">TABLE THEME</div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(TableTheme).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => onUpdateSettings({ ...settings, theme })}
                      className={`
                        py-3 px-4 rounded-xl border-2 text-xs font-bold transition-all
                        ${settings.theme === theme 
                          ? 'border-yellow-600 bg-yellow-600/10 text-white' 
                           : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'}
                      `}
                    >
                      {theme.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key */}
              <div className="space-y-4">
                <div className="text-sm font-bold text-white tracking-wide">GEMINI API KEY</div>
                <input
                  type="password"
                  placeholder="Enter your API Key"
                  value={settings.apiKey || ''}
                  onChange={(e) => onUpdateSettings({ ...settings, apiKey: e.target.value })}
                  className="w-full bg-zinc-800 text-white rounded-lg p-3 text-sm border border-white/10 focus:border-yellow-600 focus:outline-none"
                />
                <p className="text-[10px] text-gray-500">Required for AI Dealer commentary. Key is stored locally in your browser.</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full mt-10 py-4 bg-white text-black font-bold rounded-xl tracking-[0.2em]"
            >
              SAVE CHANGES
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
