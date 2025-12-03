import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { AnimatedBackground } from "./AnimatedBackground";

interface CareerSlideProps {
  career: "chef" | "bartender" | "aviation";
  title: string;
  description: string;
  image: string;
  youtubeUrl: string;
  isActive: boolean;
  onOpenGame: () => void;
}

export const CareerSlide = ({ career, title, description, image, youtubeUrl, isActive, onOpenGame }: CareerSlideProps) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatedBackground career={career} />
      
      <div className="relative z-10 container mx-auto h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 sm:px-8 lg:px-16 pt-24 lg:pt-0">
        {/* Text Content */}
        <motion.div
          className="flex-1 text-white space-y-4 sm:space-y-6 max-w-xl text-center lg:text-left"
          initial={{ opacity: 0, x: -100 }}
          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight"
            animate={isActive ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {title}
          </motion.h2>
          
          <motion.p
            className="text-base sm:text-xl lg:text-2xl text-white/90"
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col gap-3 sm:gap-4 relative z-20"
          >
            <Button
              size="lg"
              asChild
              className={`text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 font-bold hover:scale-105 transition-transform duration-300 shadow-2xl ${
                career === "chef" 
                  ? "bg-transparent border-2 border-chef-secondary text-white hover:bg-chef-secondary/20" 
                  : career === "bartender" 
                    ? "bg-transparent border-2 border-bartender-secondary text-white hover:bg-bartender-secondary/20" 
                    : "bg-transparent border-2 border-aviation-secondary text-white hover:bg-aviation-secondary/20"
              }`}
            >
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                Ver más de la carrera
              </a>
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenGame();
              }}
              className={`text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 font-bold hover:scale-105 transition-transform duration-300 shadow-2xl cursor-pointer ${
                career === "chef" 
                  ? "bg-chef-secondary text-white hover:bg-chef-primary" 
                  : career === "bartender" 
                    ? "bg-bartender-secondary text-white hover:bg-bartender-primary" 
                    : "bg-aviation-secondary text-white hover:bg-aviation-primary"
              }`}
            >
              🎮 ¡Jugar Ahora!
            </Button>
          </motion.div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="flex-1 relative h-[40vh] sm:h-[50vh] lg:h-[80vh] w-full lg:block"
          initial={{ opacity: 0, x: 100 }}
          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.img
            src={image}
            alt={title}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-full object-contain drop-shadow-2xl mix-blend-multiply"
            style={{ filter: "contrast(1.1) brightness(1.05)" }}
            animate={isActive ? {
              y: ["-50%", "-52%", "-50%"],
              scale: [1, 1.02, 1],
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};
