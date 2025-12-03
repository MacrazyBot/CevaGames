import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AviationGame } from "./AviationGame";
import { ChefGame } from "./ChefGame";
import { BartenderGame } from "./BartenderGame";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType: "chef" | "bartender" | "aviation";
}

export const GameModal = ({ isOpen, onClose, gameType }: GameModalProps) => {
  if (!isOpen) return null;

  const renderGame = () => {
    switch (gameType) {
      case "aviation":
        return <AviationGame onClose={onClose} />;
      case "chef":
        return <ChefGame onClose={onClose} />;
      case "bartender":
        return <BartenderGame onClose={onClose} />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-white/70 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          {renderGame()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
