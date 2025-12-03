import { motion } from "framer-motion";
import { Button } from "../ui/button";

interface CevaturaMessageProps {
  onContinue: () => void;
  onCancel: () => void;
}

export const CevaturaMessage = ({ onContinue, onCancel }: CevaturaMessageProps) => {
  return (
    <motion.div
      className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="text-6xl mb-4"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        🎉
      </motion.div>
      
      <motion.h3
        className="text-2xl sm:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        ¡VAS MUY BIEN!
      </motion.h3>
      
      <motion.p
        className="text-white/90 text-center text-m mb-6 max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        CEVATUR PIURA TIENE 50 AÑOS EN EL RUBRO DE TURISMO, ¿QUIERES CONTINUAR PARA GANAR Y ACCEDER A NUESTRAS OFERTAS?
      </motion.p>
      
      <motion.div
        className="flex gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={onContinue}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-6 text-lg hover:scale-105 transition-transform"
        >
          ¡SÍ, CONTINUAR!
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-white/30 text-black hover:bg-white/10 px-6 py-6"
        >
          Salir
        </Button>
      </motion.div>
    </motion.div>
  );
};
