import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RunSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    totalHands: number;
    totalWins: number;
    peakBankroll: number;
    lifetimeEarnings: number;
    refillsUsed: number;
    stagesReached: number;
  };
}

const RunSummary: React.FC<RunSummaryProps> = ({ isOpen, stats, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4"
        >
          <div className="max-w-2xl w-full">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="parchment-bg border-4 border-[#3a0a0a] rounded-sm p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] relative overflow-hidden"
                style={{ clipPath: 'polygon(1% 1%, 99% 0.5%, 100% 3%, 98.5% 98%, 97% 100%, 2% 99%, 0% 97%, 1% 4%)' }}
            >
                {/* Background Grain Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
                
                <h2 className="text-4xl font-['Special_Elite'] font-bold text-[#1a1a1a] mb-2 text-center tracking-widest uppercase">THE FINAL RECORD</h2>
                <div className="w-24 h-1 bg-[#8b0000] mx-auto mb-8 opacity-40" />

                <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
                    {[
                        { label: 'Total Hands', value: stats.totalHands, color: 'text-[#1a1a1a]' },
                        { label: 'Wins', value: stats.totalWins, color: 'text-[#0d1a0d]' },
                        { label: 'Peak Bankroll', value: `$${stats.peakBankroll}`, color: 'text-[#1a1a1a]' },
                        { label: 'Stages Cleared', value: stats.stagesReached, color: 'text-[#3a0a0a]' },
                        { label: 'Total Refills', value: stats.refillsUsed, color: 'text-[#8b0000]' },
                        { label: 'Win Rate', value: `${stats.totalHands > 0 ? ((stats.totalWins / stats.totalHands) * 100).toFixed(0) : 0}%`, color: 'text-[#1a1a1a]' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-black/5 border border-[#1a1a1a]/10 rounded-sm p-4 text-center font-['Special_Elite']">
                            <p className="text-[10px] font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-[#8b0000]/5 border-2 border-[#8b0000]/20 rounded-sm p-6 mb-8 text-center relative z-10">
                    <p className="text-xs text-[#8b0000]/60 uppercase font-bold tracking-widest mb-1 font-serif">Run Lifetime Earnings</p>
                    <p className="text-5xl font-['Special_Elite'] font-black text-[#8b0000]">${stats.lifetimeEarnings}</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05, border: '2px solid #8b0000' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="w-full py-4 bg-transparent border-2 border-[#1a1a1a] text-[#1a1a1a] font-['Special_Elite'] font-black rounded-sm tracking-widest transition-all uppercase text-xl"
                >
                    LEAVE THE TABLE
                </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RunSummary;
