import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Trophy } from "lucide-react";

interface VictoryScreenProps {
  onClaim: () => void;
}

export const VictoryScreen = ({ onClaim }: VictoryScreenProps) => {
  return (
    <motion.div
      className="p-8 text-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", damping: 10 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="text-8xl mb-6"
      >
        🏆
      </motion.div>
      
      <motion.h2
        className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-4"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        ¡GANASTE!
      </motion.h2>
      
      <motion.div
        className="flex justify-center gap-2 mb-6"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, staggerChildren: 0.1 }}
      >
        {["🎉", "🎊", "✨", "🌟", "💫"].map((emoji, i) => (
          <motion.span
            key={i}
            className="text-4xl"
            animate={{ y: [0, -20, 0], rotate: [0, 360] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>

      <p className="text-white/80 text-lg mb-6">
        ¡Eres un experto! Completa tus datos para reclamar tu premio.
      </p>

      <Button
        onClick={onClaim}
        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg px-8 py-6 hover:scale-105 transition-transform"
      >
        <Trophy className="mr-2" /> Reclamar Premio
      </Button>
    </motion.div>
  );
};
