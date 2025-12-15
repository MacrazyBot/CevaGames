import { motion } from "framer-motion";
import { Button } from "../ui/button";

interface CevaturaMessageProps {
  onContinue: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export const CevaturaMessage = ({ 
  onContinue, 
  onCancel,
  title = "¡VAS MUY BIEN!",
  message = "CEVATUR PIURA TIENE 50 AÑOS EN EL RUBRO DE TURISMO, ¿QUIERES CONTINUAR PARA GANAR Y ACCEDER A NUESTRAS OFERTAS?"
}: CevaturaMessageProps) => {
  return (
    <motion.div
      className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-3 sm:p-6 z-30 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="text-4xl sm:text-6xl mb-2 sm:mb-4"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        🎉
      </motion.div>
      
      <motion.h3
        className="text-xl sm:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2 sm:mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        className="text-white/90 text-center text-sm sm:text-lg mb-4 sm:mb-6 max-w-md px-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {message}
      </motion.p>
      
      <motion.div
        className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={onContinue}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg hover:scale-105 transition-transform w-full sm:w-auto"
        >
          ¡SÍ, CONTINUAR!
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10 px-4 sm:px-6 py-4 sm:py-6 w-full sm:w-auto"
        >
          Salir
        </Button>
      </motion.div>
    </motion.div>
  );
};
